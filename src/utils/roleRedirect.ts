export function getDashboardPathByRole(role?: string | null): string {
  const roleUpper = (role || '').toUpperCase();

  if (
    roleUpper === 'SALES_MARKETING_SPV' ||
    roleUpper.includes('SALES_SUPERVISOR') ||
    (roleUpper.includes('SALES') && (roleUpper.includes('SPV') || roleUpper.includes('SUPERVISOR')))
  ) {
    return '/sales/supervisor';
  }

  if (roleUpper === 'SALES' || roleUpper.includes('SALES')) {
    return '/sales/staff';
  }

  if (
    roleUpper.includes('CONTENT_CREATOR') ||
    roleUpper.includes('SOCIAL') ||
    roleUpper.includes('SMM') ||
    roleUpper.includes('SOSMED')
  ) {
    return '/social-media';
  }

  if (
    roleUpper.includes('CMO') ||
    (roleUpper.includes('MARKETING') && !roleUpper.includes('SALES')) ||
    roleUpper.includes('C_LEVEL')
  ) {
    return '/cmo';
  }

  if (
    roleUpper === 'ADMIN_SPV' ||
    roleUpper === 'SUPERVISOR_ADMIN' ||
    (roleUpper.includes('ADMIN') && (roleUpper.includes('SPV') || roleUpper.includes('SUPERVISOR')))
  ) {
    return '/admin/supervisor';
  }

  if (
    roleUpper === 'ADMIN' ||
    roleUpper === 'STAFF_ADMIN' ||
    roleUpper === 'STAFF' ||
    roleUpper.includes('CS') ||
    roleUpper.includes('SUPPORT')
  ) {
    return '/admin/staff';
  }

  return '/sales/staff';
}
