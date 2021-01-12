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
			value == "" ||
			value == null ||
			value == undefined ||
			(value != null && typeof value == "object" && !Object.keys(value).length)
		) {
			return true;
		} else {
			return false;
		}
	}
}
