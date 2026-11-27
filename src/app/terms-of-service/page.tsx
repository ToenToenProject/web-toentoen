import type { Metadata } from 'next';
import { TermsOfServiceContent } from '@/components/terms-of-service/TermsOfServiceContent';
import { TERMS_OF_SERVICE_META } from '@/constants/terms-of-service';

export const metadata: Metadata = {
  title: `${TERMS_OF_SERVICE_META.title} | Toentoen`,
  description:
    'Syarat dan Ketentuan Penggunaan Aplikasi Toentoen yang mengatur hak, kewajiban, dan tanggung jawab Pengguna serta Merchant.',
};

export default function TermsOfServicePage() {
  return <TermsOfServiceContent />;
}
