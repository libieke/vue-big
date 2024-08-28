export default function checkPermission(permission_code, meta) {
  const { permission_btns } = meta
  if (!permission_btns) return
  const menuCodes = permission_btns.map(btn => {
    return btn.menuCode
  })
  if (permission_code && menuCodes) {
    return menuCodes.includes(permission_code)
  } else {
    console.error(`need roles! Like v-permission="['admin','editor']"`)
    return false
  }
}
