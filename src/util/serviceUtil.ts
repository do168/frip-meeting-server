import { DateFormatException, NullException } from './customException';

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
}
