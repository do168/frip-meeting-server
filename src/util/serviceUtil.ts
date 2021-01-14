import { NullException } from './customException';

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
      isNaN(value) ||
      (value != null && typeof value == 'object' && !Object.keys(value).length)
    ) {
      return true;
    } else {
      return false;
    }
  }

  // 객체의 속성 중 빈 값 체크
  public isEmptyPostParam(obj: any, keys: any): void {
    for (let key in keys) {
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
}
