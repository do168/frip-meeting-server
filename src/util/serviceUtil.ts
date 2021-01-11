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
}
