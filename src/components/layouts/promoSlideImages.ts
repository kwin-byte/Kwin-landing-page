const modules = import.meta.glob('../../assets/images/imagesData/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
  import: 'default'
}) as Record<string, string>

function numericSortKey(path: string): number {
  const m = path.match(/(\d+)/)
  return m ? parseInt(m[1], 10) : 0
}

/** Tất cả ảnh trong images/imagesData, sắp xếp theo số trong tên file */
export const promoSlideImageUrls = Object.entries(modules)
  .sort((a, b) => numericSortKey(a[0]) - numericSortKey(b[0]))
  .map(([, url]) => url)
