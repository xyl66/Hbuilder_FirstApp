//					关闭预览
/**
 * @description 关闭预览
 */
function closePreview(){
	var previewImage = mui.isFunction(mui.getPreviewImage) && mui.getPreviewImage();
	if(previewImage && previewImage.isShown()) {
		previewImage.close();
		return true;
	}
}