import { ReturnModel } from '../model/ReturnModel';

export default class serviceUtil {
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
  public isEmptyPostParam(obj: any, keys: any): boolean {
    for (let key in keys) {
      if (this.isEmpty(obj[keys[key]])) {
        return true;
      }
    }
    return false;
  }

  /**
   * 서비스계층에서 return 시 ReturnModel 인터페이스 타입으로 리턴
   * @param status http 상태코드
   * @param message 리턴 메세지
   */
  public returnMethod(status: number, message: any): ReturnModel {
    const model = {
      status: status,
      message: message,
    };
    return model;
  }

  // parse a date in yyyy-mm-dd format
  public parseDate(input: string): Date {
    const parts = input.split('-');
    // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])); // Note: months are 0-based
  }
}
