import { Connection } from '../model/Connections/Connection';
import { Page } from '../model/Connections/Page';
import { PageValidate } from '../model/enum/PageValidate';
import { Meeting } from '../model/resource/Meeting';
import { Review } from '../model/resource/Review';
import { CursorValueException, DateFormatException, NullException } from './customException';

export default class ServiceUtil {
  /**
   * 페이지 번호와 지정된 페이지 크기를 이용하여 Offset 계산
   * @param pageNum 페이지 번호
   * @param pageSize 페이지 크기
   * @return offset 오프셋
   */
  public caculateOffset(pageNum: number, pageSize: number): number {
    const offset = (pageNum - 1) * pageSize;
    return offset;
  }

  // 넘어온 값이 빈값인지 체크합니다.
  // !value 하면 생기는 논리적 오류를 제거하기 위해
  // 명시적으로 value == 사용
  // [], {} 도 빈값으로 처리
  public isEmpty(value: any): boolean {
    if (
      value == '' ||
      value == null ||
      value == undefined ||
      value == String(undefined) ||
      value == Number(undefined) ||
      (value != null && typeof value == 'object' && !Object.keys(value).length)
    ) {
      return true;
    } else {
      return false;
    }
  }

  // 객체의 속성 중 빈 값 체크
  public checkEmptyPostParam(obj: any, keys: any): void {
    for (const key in keys) {
      if (this.isEmpty(obj[keys[key]])) {
        throw new NullException(keys[key]);
      }
    }
  }

  public isBeforeTime(comparing: number, standard: number, conditionTime: number): boolean {
    if (standard - comparing >= conditionTime) {
      return true;
    } else {
      return false;
    }
  }

  public isAfterTime(comparing: number, standard: number, conditionTime: number): boolean {
    if (comparing - standard > conditionTime) {
      return true;
    } else {
      return false;
    }
  }

  // Date 형식을 가독성 좋은 문자열로 변경
  public dateToStr(format: Date): string {
    const year = format.getFullYear();

    let month: number | string = format.getMonth() + 1;

    if (month < 10) month = '0' + month;

    let date: number | string = format.getDate();

    if (date < 10) date = '0' + date;

    let hour: number | string = format.getHours();

    if (hour < 10) hour = '0' + hour;

    let min: number | string = format.getMinutes();

    if (min < 10) min = '0' + min;

    let sec: number | string = format.getSeconds();

    if (sec < 10) sec = '0' + sec;

    return year + '-' + month + '-' + date + ' ' + hour + ':' + min + ':' + sec;
  }

  // Date 형식인지 체크
  public checkCorrectDateFormat(format: string): void {
    const datetimeRegexp = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]/;
    if (!datetimeRegexp.test(format)) {
      throw new DateFormatException();
    }
  }

  public convertCursor(id: number | string, type: string): string {
    return Buffer.from(id + '/' + type, 'binary').toString('base64');
  }

  public convertId(cursor: string | undefined): number | string {
    if (cursor === undefined) throw new CursorValueException();

    const decodedCursor = Buffer.from(cursor, 'base64').toString('binary');
    const id = decodedCursor.split('/')[0];

    if (id === undefined) {
      throw new CursorValueException();
    }

    return id;
  }

  public makePageType(pageNumParam: number, pageSizeParam: number, firstParam: number, afterParam: string): Page {
    const page = {
      // graphql에서는 first+after 로 페이징을 한다. pageNum이나 pageSize에 어떤 입력값이 들어오면
      // Repository 단에서 에러처리한다.
      pageNum: pageNumParam || PageValidate.INVALIDATE,
      pageSize: pageSizeParam || PageValidate.INVALIDATE,
      // hasNextPage를 위해 주어진 first 값보다 하나 더 많이 가져온다
      first: firstParam ? Number(firstParam) + 1 : 1,
      after: afterParam ? Number(this.convertId(afterParam)) : PageValidate.INVALIDATE, // default값은 max id로 한다.
    };
    return page;
  }

  public makeConnection(result: (Meeting | Review)[], page: Page, type: string): Connection<any> {
    // 결과 길이가 orginFirst + 1 과 같다면 originFirst로, 아니라면 그거보다 작은 result 자체를 totalCount로 한다.
    if (result.length == 0) {
      return {
        totalCount: 0,
        pageInfo: {
          hasNextPage: false,
          endCursor: '',
        },
        edges: [],
      };
    }
    const totalcount = result.length == page.first ? page.first - 1 : result.length;
    // 길이로 다음 페이지가 존재한느지 검사
    const hasNextPage = result.length == page.first;
    // 하나 더 많이 가져왔기에 마지막 하나는 자른다
    const nodes = hasNextPage ? result.slice(0, -1) : result;

    const edges = nodes.map((node) => {
      return {
        node: node,
        // Id와 타입을 base64 인코딩
        cursor: this.convertCursor(node.id, type),
      };
    });

    return {
      totalCount: totalcount,
      pageInfo: {
        hasNextPage: hasNextPage,
        // 마지막에 위치하는 값을 endCursor로 한다.
        endCursor: this.convertCursor(nodes[nodes.length - 1].id, type),
      },
      edges: edges || [],
    };
  }
}
