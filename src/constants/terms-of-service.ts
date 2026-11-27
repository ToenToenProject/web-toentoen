import type { PolicySection } from './privacy-policy';

export const TERMS_OF_SERVICE_META = {
  lastUpdated: '27 November 2026',
  title: 'Syarat dan Ketentuan Penggunaan Aplikasi Toentoen',
};

export const TERMS_OF_SERVICE_INTRO: string[] = [
  'Selamat datang di <strong>Toentoen</strong>.',
  'Syarat dan Ketentuan yang ditetapkan di bawah ini mengatur hak, kewajiban, dan tanggung jawab Pengguna terhadap penggunaan layanan, fitur, dan/atau jasa yang diakses oleh Pengguna melalui aplikasi Toentoen dan segala situs dan/atau aplikasi turunannya yang dikelola oleh kami. Pengguna disarankan untuk membaca dengan saksama.',
  'Dengan mengunduh, mengakses, dan/atau menggunakan aplikasi Toentoen, Anda (selanjutnya disebut <strong>"Pengguna"</strong> dan/atau <strong>"Merchant"</strong>) menyatakan bahwa Anda telah membaca, memahami, dan menyetujui untuk terikat secara hukum sesuai dengan Syarat dan Ketentuan berikut:',
];

export const TERMS_OF_SERVICE_SECTIONS: PolicySection[] = [
  {
    id: 'definisi',
    heading: '1. Definisi',
    content: [
      {
        type: 'unordered-list',
        items: [
          '<strong>Toentoen</strong> adalah platform aplikasi berbasis digital yang bertindak sebagai penyedia layanan perantara (<em>intermediary service provider</em>). Platform ini berfungsi menghubungkan Merchant (penjual) dengan Pengguna (pembeli/konsumen) untuk memfasilitasi transaksi dan interaksi dua arah di dalam aplikasi.',
          '<strong>Merchant</strong> adalah pihak kedua, baik perorangan maupun badan usaha/badan hukum, yang mendaftarkan diri pada platform Toentoen untuk menawarkan, memasarkan, dan/atau menjual produk atau layanan kepada Pengguna melalui platform Toentoen.',
          '<strong>Pengguna</strong> adalah setiap orang perorangan maupun subjek hukum yang melakukan registrasi, memiliki akun, dan/atau menggunakan platform Toentoen untuk melakukan pencarian, pemesanan, atau pembelian produk dan/atau layanan yang disediakan oleh Merchant yang bisa disebut sebagai <strong>Toeners</strong>.',
          '<strong>Aplikasi</strong> adalah platform digital Toentoen yang dapat digunakan melalui perangkat elektronik dan tersedia pada sistem operasi iOS dan Android untuk mengakses layanan serta fitur yang disediakan oleh Toentoen.',
          '<strong>Situs</strong> adalah website resmi Toentoen yang dapat diakses melalui internet untuk menggunakan layanan, melihat informasi, dan mengakses fitur yang disediakan oleh Toentoen.',
          '<strong>Produk</strong> adalah setiap bentuk pelayanan atau pekerjaan yang ditawarkan oleh Merchant kepada Pengguna melalui platform Toentoen.',
          '<strong>Jasa</strong> adalah seluruh fitur, sistem, fasilitas, dan layanan yang disediakan oleh Toentoen untuk membantu Pengguna menemukan Merchant, produk, jasa, promosi, dan informasi tempat usaha melalui platform.',
          '<strong>Layanan</strong> adalah seluruh fitur, sistem, fasilitas, dan layanan yang disediakan oleh Toentoen untuk membantu Pengguna menemukan Merchant, produk, jasa, promosi, dan informasi tempat usaha melalui platform.',
          '<strong>Nomor Induk Berusaha (NIB)</strong> adalah identitas resmi sekaligus bukti legalitas bagi pelaku usaha di Indonesia yang diterbitkan oleh Lembaga Online Single Submission (OSS) milik pemerintah.',
          '<strong>Bukti Pemenuhan Standar</strong> adalah dokumen pernyataan dan/atau bukti sah yang menyatakan bahwa suatu kegiatan usaha, layanan, dan/atau produk telah memenuhi kriteria dan standar operasional yang ditetapkan oleh pemerintah atau lembaga berwenang, termasuk namun tidak terbatas pada: sertifikat SNI (Standar Nasional Indonesia), sertifikat Halal &amp; Nomor Izin Edar (NIE).',
        ],
      },
    ],
  },
  {
    id: 'peran-toentoen',
    heading: '2. Peran Toentoen (Disclaimer Perantara)',
    content: [
      {
        type: 'paragraph',
        text: 'Toentoen adalah platform perantara yang memfasilitasi transaksi antara Pengguna dan Merchant. Platform ini berwenang melakukan pengawasan terhadap produk dan/atau layanan yang ditawarkan oleh Merchant dengan tujuan memastikan bahwa semua kegiatan tersebut mematuhi peraturan perundang-undangan yang berlaku di Negara Republik Indonesia serta kebijakan yang ditetapkan oleh platform Toentoen. User dan/atau Merchant yang dilaporkan melanggar ketentuan platform dapat dikenakan sanksi berupa pengurangan poin, pembatasan layanan, penangguhan sementara akun, atau tindakan lainnya sesuai dengan kebijakan yang berlaku di platform Toentoen.',
      },
      {
        type: 'paragraph',
        text: 'Toentoen tidak bertanggung jawab atas kualitas, keamanan, legalitas, kelayakan, maupun keaslian barang dan/atau jasa yang ditawarkan, disediakan, atau diperdagangkan oleh Merchant melalui platform. Seluruh tanggung jawab terkait barang dan/atau jasa tersebut sepenuhnya berada pada Merchant sebagai pihak penyedia.',
      },
      {
        type: 'paragraph',
        text: '<strong>Kebijakan Toentoen terkait dengan verifikasi NIB (Nomor Induk Berusaha), Izin Usaha, Bukti Pemenuhan Standar &amp; Informasi Produk yang diatur oleh hukum:</strong>',
      },
      {
        type: 'ordered-list',
        items: [
          'Toentoen tidak dapat melakukan verifikasi otomatis maupun verifikasi substantif atas keabsahan, keaslian, atau kepemilikan Nomor Induk Berusaha (NIB), Izin Usaha, Bukti Pemenuhan Standar &amp; Informasi Produk yang didaftarkan oleh Pengguna.',
          'Pengguna dengan ini menyatakan dan menjamin bahwa seluruh data, informasi, dan dokumen, termasuk namun tidak terbatas pada Nomor Induk Berusaha (NIB), Izin Usaha, Bukti Pemenuhan Standar &amp; Informasi Produk, yang disampaikan kepada Toentoen adalah benar, sah, akurat, dan tidak melanggar ketentuan peraturan perundang-undangan yang berlaku.',
          'Pengguna bertanggung jawab sepenuhnya atas segala akibat hukum yang timbul dari penyampaian data atau dokumen yang tidak benar, palsu, menyesatkan, atau digunakan tanpa hak.',
          'Apabila Toentoen menemukan atau memperoleh indikasi adanya pemalsuan, penyalahgunaan, atau tindakan penipuan yang berkaitan dengan Nomor Induk Berusaha (NIB), Izin Usaha, Bukti Pemenuhan Standar dan/atau Informasi Produk yang didaftarkan oleh Pengguna, Toentoen berhak, atas pertimbangannya sendiri, untuk: (a) memberikan peringatan kepada Pengguna/Merchant; (b) melakukan verifikasi tambahan terhadap identitas Pengguna berdasarkan data Kartu Tanda Penduduk (KTP) atau dokumen identitas lain yang sah; (c) menangguhkan atau menghentikan akses Pengguna terhadap layanan Toentoen, baik untuk sementara maupun secara permanen; dan/atau (d) mengambil tindakan lain yang dianggap perlu, termasuk melaporkan dugaan pelanggaran kepada instansi yang berwenang atau menempuh upaya hukum sesuai dengan ketentuan peraturan perundang-undangan yang berlaku.',
          'Toentoen tidak bertanggung jawab atas kerugian dalam bentuk apa pun yang timbul sebagai akibat dari penggunaan Nomor Induk Berusaha (NIB), Izin Usaha, Bukti Pemenuhan Standar &amp; Informasi Produk yang tidak sah, palsu, atau digunakan tanpa hak oleh Pengguna.',
        ],
      },
    ],
  },
  {
    id: 'akun-keamanan',
    heading: '3. Akun dan Keamanan',
    content: [
      {
        type: 'ordered-list',
        items: [
          'Pengguna dan/atau Merchant menyatakan dan menjamin bahwa Pengguna dan/atau Merchant telah berusia minimal 18 (delapan belas) tahun dan tidak berada di bawah perwalian atau pengampuan dan Pengguna secara hukum memiliki kapasitas dan berhak untuk mengikatkan diri pada Syarat dan Ketentuan ini. Jika Pengguna tidak memenuhi ketentuan tersebut namun tetap mengakses atau menggunakan Situs/Aplikasi, layanan yang tersedia di Situs/Aplikasi, konten pihak ketiga yang berada di Situs/Aplikasi, penawaran di Situs/Aplikasi atau metode pembayaran yang berlaku di Situs/Aplikasi, Pengguna menyatakan dan menjamin bahwa tindakan Pengguna membuka, mengakses, atau melakukan aktivitas lain dalam Situs/Aplikasi telah disetujui oleh orang tua, wali, atau pengampu Pengguna. Pengguna secara tegas mengesampingkan setiap hak berdasarkan peraturan perundang-undangan yang berlaku untuk membatalkan atau mencabut setiap dan seluruh persetujuan yang Pengguna berikan berdasarkan Syarat dan Ketentuan ini pada waktu Pengguna dianggap telah dewasa secara hukum.',
          'Toentoen tidak memungut biaya dalam bentuk apa pun untuk pendaftaran akun kepada Pengguna.',
          'Pengguna wajib memberikan data, informasi, dan dokumen yang benar, akurat, terkini, serta lengkap pada saat proses pendaftaran dan selama penggunaan akun pada platform Toentoen.',
          'Pengguna memahami dan menyetujui bahwa 1 (satu) nomor telepon dan e-mail hanya dapat digunakan untuk mendaftarkan 1 (satu) akun Pengguna/Merchant.',
          'Pengguna dan/atau Merchant bertanggung jawab penuh atas kerahasiaan, keamanan, serta seluruh aktivitas yang terjadi melalui akun masing-masing di platform Toentoen. Tanggung jawab ini meliputi menjaga kerahasiaan alamat email, kata sandi (<em>password</em>), kode verifikasi (OTP), dan semua bentuk akses lainnya yang terkait dengan akun Anda. Anda juga bertanggung jawab penuh atas segala aktivitas yang dilakukan menggunakan akun tersebut, baik oleh Anda sendiri maupun oleh orang lain yang menggunakan akun Anda.',
          'Merchant yang telah mendaftarkan bisnisnya diharapkan untuk melakukan aktivitas atau pembaruan konten bisnis atau barang/jasa yang diperdagangkan dalam jangka waktu 60 (enam puluh) hari. Jika dalam jangka waktu 60 (enam puluh) hari tidak terdapat aktivitas atau pembaruan konten, maka Merchant menyetujui dan memahami bahwa pihak Toentoen berhak untuk melakukan moderasi dan/atau penutupan bisnis tanpa pemberitahuan sebelumnya.',
          'Pengguna dan/atau Merchant menyetujui dan memahami bahwa Toentoen berhak melakukan pembatasan, penangguhan sementara, pembekuan akun, dan/atau tindakan-tindakan lainnya apabila ditemukan adanya dugaan dan/atau indikasi kecurangan, penipuan, penyalahgunaan layanan, aktivitas mencurigakan, maupun pelanggaran terhadap ketentuan hukum Negara Kesatuan Republik Indonesia dan kebijakan platform yang berlaku tanpa adanya pemberitahuan sebelumnya.',
          'Pengguna dan/atau Merchant menyetujui dan memahami dengan sepenuhnya untuk tidak menggunakan dan/atau mengakses sistem Toentoen secara langsung atau tidak langsung baik keseluruhan atau sebagian dengan virus, perangkat lunak, atau teknologi lainnya yang dapat melemahkan, merusak, mengganggu atau menghambat, membatasi dan/atau mengambil alih fungsionalitas serta integritas dari sistem perangkat lunak atau perangkat keras, jaringan, dan/atau data pada Situs/Aplikasi Toentoen.',
          'Pengguna dan/atau Merchant dilarang untuk menciptakan dan/atau menggunakan perangkat keras/lunak/fitur dan/atau alat lainnya, termasuk namun tidak terbatas pada emulator, robot, macro, crawler, dan/atau perangkat otomatis yang bertujuan untuk mengakses atau menggunakan layanan pada sistem Toentoen, seperti namun tidak terbatas pada: (i) manipulasi data; (ii) membuat banyak akun; (iii) memanipulasi perangkat yang bertujuan untuk merugikan Toentoen, Pengguna dan/atau Merchant; (iv) kegiatan perambanan (<em>crawling/scraping</em>) atau penyalinan konten; (v) kegiatan otomatisasi dalam transaksi, jual beli, promosi dan lain sebagainya; (vi) penambahan produk/jasa; (vii) mengumpulkan (<em>harvest</em>) atau mencuri data pengguna; (viii) melakukan spamming, mengirimkan komunikasi elektronik dalam jumlah besar, mengirimkan surat berantai; dan/atau (ix) aktivitas lain yang secara wajar dapat dinilai sebagai tindakan manipulasi dan perusakan layanan dan sistem Toentoen.',
          'Pengguna dan/atau Merchant dengan ini menyatakan bahwa Toentoen tidak bertanggung jawab atas kerugian ataupun kendala yang timbul atas penyalahgunaan akun Pengguna dan/atau Merchant yang diakibatkan oleh kelalaian Pengguna dan/atau Merchant, termasuk namun tidak terbatas pada: menyetujui dan/atau memberikan akses masuk akun yang dikirimkan oleh Toentoen melalui pesan notifikasi kepada pihak lain melalui perangkat Pengguna, meminjamkan akun kepada pihak lain, mengakses link atau tautan yang diberikan oleh pihak lain, memberikan atau memperlihatkan kode verifikasi (OTP), password, atau e-mail kepada pihak lain, maupun kelalaian Pengguna dan/atau Merchant lainnya yang mengakibatkan kerugian ataupun kendala pada akun Pengguna dan/atau Merchant.',
        ],
      },
    ],
  },
  {
    id: 'ketentuan-merchant',
    heading: '4. Ketentuan Khusus Bagi Merchant',
    content: [
      {
        type: 'ordered-list',
        items: [
          'Merchant dengan ini menyatakan bahwa Toentoen tidak bertanggung jawab atas kualitas, keamanan, legalitas, kelayakan, maupun keaslian barang dan/atau jasa yang ditawarkan, disediakan, atau diperdagangkan oleh Merchant melalui platform Toentoen. Seluruh tanggung jawab mengenai barang dan/atau jasa tersebut, termasuk segala risiko yang timbul darinya, sepenuhnya berada pada Merchant selaku pihak penyedia.',
          'Merchant menyatakan bahwa Merchant bertanggung jawab sepenuhnya atas ketersediaan barang atau jasa, pemenuhan pesanan, pelaksanaan layanan, serta penyelesaian layanan purna jual (garansi, komplain, pengembalian, dan lain sebagainya) kepada Pengguna. Toentoen hanya bertindak sebagai penyedia platform perantara yang mempertemukan Pengguna dengan Merchant. Oleh karena itu, Toentoen tidak bertanggung jawab atas pelaksanaan, kualitas, atau penyelesaian transaksi antara Pengguna dan Merchant.',
          'Dalam hal Merchant belum memiliki Nomor Induk Berusaha (NIB) pada saat melakukan pendaftaran, Merchant wajib memperoleh dan menyampaikan NIB yang sah kepada Toentoen paling lambat dalam jangka waktu 6 (enam) bulan sejak tanggal pendaftaran.',
          'Apabila Merchant tidak memenuhi kewajiban tersebut dalam jangka waktu yang telah ditentukan, segala konsekuensi administratif, perdata, pidana, maupun konsekuensi hukum lainnya yang timbul sehubungan dengan ketidakpatuhan terhadap ketentuan peraturan perundang-undangan mengenai perizinan berusaha sepenuhnya menjadi tanggung jawab Merchant.',
          'Merchant dengan ini membebaskan dan melepaskan Toentoen dari setiap tuntutan, klaim, gugatan, kerugian, sanksi, maupun tanggung jawab dalam bentuk apa pun yang timbul akibat tidak dipenuhinya kewajiban Merchant untuk memperoleh atau memiliki Nomor Induk Berusaha (NIB). Dalam hal terdapat tindakan, pemeriksaan, atau penegakan hukum oleh instansi pemerintah yang berwenang terkait ketidakpatuhan tersebut, Toentoen tidak bertanggung jawab dan tidak berkewajiban untuk mewakili, mendampingi, atau menanggung akibat hukum yang timbul atas tindakan Merchant.',
          'Merchant yang berdomisili dan/atau dimiliki oleh pihak luar negeri wajib menyertakan surat izin berusaha di Indonesia &amp; bukti pemenuhan standar dan/atau persyaratan teknis barang/jasa yang diwajibkan.',
          'Merchant dilarang menawarkan, memperdagangkan, atau mendistribusikan produk dan/atau jasa yang bertentangan dengan ketentuan peraturan perundang-undangan di Negara Kesatuan Republik Indonesia, termasuk namun tidak terbatas pada narkotika, barang ilegal, konten eksplisit, serta barang dan/atau layanan terlarang lainnya.',
        ],
      },
    ],
  },
  {
    id: 'perilaku-pengguna',
    heading: '5. Perilaku Pengguna',
    content: [
      {
        type: 'paragraph',
        text: 'Setiap ulasan dan penilaian (<em>rating</em>) yang diberikan oleh Pengguna harus benar-benar berdasarkan pengalaman pribadi yang dialami dan dilakukan dengan iktikad baik. Ulasan tersebut dilarang mengandung kata-kata penghinaan, pencemaran nama baik, ujaran kebencian, diskriminasi, atau muatan SARA (Suku, Agama, Ras, dan Antargolongan).',
      },
    ],
  },
  {
    id: 'batasan-tanggung-jawab',
    heading: '6. Batasan Tanggung Jawab',
    content: [
      {
        type: 'paragraph',
        text: 'Anda menyatakan bahwa Anda melepaskan seluruh pihak Toentoen (termasuk Pemilik, karyawan, dan Perusahaan) dari tanggung jawab atas segala kerugian, cedera, tuntutan hukum, atau perselisihan dari setiap jenis dan sifatnya yang timbul karena, namun tidak terbatas pada, hubungan, transaksi, atau interaksi antara Pengguna dan Merchant, apabila hal tersebut terjadi di luar kendali, kewenangan, atau sistem teknis yang dimiliki oleh platform Toentoen. Dengan demikian Anda dengan sengaja dan kesadaran penuh melepaskan segala perlindungan hukum yang terdapat di dalam perundang-undangan atau peraturan hukum lainnya yang akan membatasi cakupan ketentuan ini.',
      },
      {
        type: 'paragraph',
        text: '<strong>Apa yang terjadi jika terjadi kegagalan dalam transaksi?</strong><br />Transaksi adalah proses komunikasi dan kesepakatan langsung antara Toeners (Pengguna) dengan Merchant. Oleh karena itu, segala kegagalan atau masalah dalam transaksi berada di luar tanggung jawab Toentoen sebagai platform perantara, kecuali jika kegagalan tersebut disebabkan oleh kelalaian dari salah satu pihak atau kedua belah pihak. Jika terdapat masalah dalam transaksi, Pengguna dapat melaporkannya kepada pihak Toentoen. Kami akan melakukan peninjauan terhadap laporan tersebut dan dapat mengenakan sanksi kepada pihak yang bersangkutan sesuai dengan ketentuan yang telah disetujui dalam Syarat dan Ketentuan platform.',
      },
      {
        type: 'paragraph',
        text: 'Toentoen tidak memberikan jaminan dalam bentuk apa pun bahwa Aplikasi dan/atau Platform akan beroperasi secara terus menerus, tanpa gangguan, kesalahan, cacat, atau kendala teknis lainnya. Layanan Toentoen disediakan dalam keadaan “sebagaimana adanya” (<em>as is</em>) dan “sebagaimana tersedia” (<em>as available</em>), tanpa jaminan secara tersurat maupun tersirat mengenai ketersediaan, keandalan, ketepatan waktu, atau kualitas Layanan. Meskipun demikian, Toentoen akan senantiasa berupaya semaksimal mungkin dengan melakukan segala usaha yang wajar dan sesuai dengan standar industri untuk menjaga ketersediaan, keamanan, kestabilan, serta kinerja Layanan agar berfungsi secara optimal.',
      },
    ],
  },
  {
    id: 'penggunaan-cookies',
    heading: '7. Penggunaan Cookies',
    content: [
      {
        type: 'paragraph',
        text: 'Toentoen menggunakan cookies dan teknologi serupa, termasuk namun tidak terbatas pada pixel, beacon, dan penyimpanan lokal (<em>local storage</em>), untuk mendukung, melindungi, dan meningkatkan kualitas layanan platform. “Cookies” adalah file data berukuran kecil yang disimpan pada perangkat Pengguna saat mengakses aplikasi atau situs web Toentoen.',
      },
      {
        type: 'paragraph',
        text: 'Cookies dan teknologi serupa digunakan untuk:',
      },
      {
        type: 'unordered-list',
        items: [
          'Mengingat preferensi, pengaturan, dan aktivitas akun Pengguna.',
          'Memproses login, autentikasi, dan menjaga keamanan akun.',
          'Memahami cara Pengguna menggunakan aplikasi dan situs web Toentoen.',
          'Menyediakan konten, rekomendasi, dan iklan yang lebih relevan.',
          'Mendeteksi, mencegah, dan menangani aktivitas yang melanggar hukum, penipuan, atau aktivitas mencurigakan lainnya.',
          'Melakukan analisis, evaluasi, dan pengembangan terhadap performa aplikasi dan situs web Toentoen.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Pengguna dapat mengatur, membatasi, atau menonaktifkan penggunaan cookies melalui pengaturan browser atau perangkat yang digunakan. Namun, penonaktifan cookies tertentu dapat menyebabkan sebagian fitur, fungsi, atau layanan Toentoen tidak dapat digunakan secara optimal.',
      },
    ],
  },
  {
    id: 'hak-kekayaan-intelektual',
    heading: '8. Hak Kekayaan Intelektual',
    content: [
      {
        type: 'paragraph',
        text: 'Seluruh logo, desain, tampilan, fitur, serta konten asli yang terdapat dalam segala platform Toentoen merupakan hak milik Toentoen dan dilindungi oleh ketentuan peraturan perundang-undangan yang berlaku di bidang kekayaan intelektual. Pengguna dilarang menyalin, menggunakan, memperbanyak, memodifikasi, mendistribusikan, atau memanfaatkan aset tersebut tanpa persetujuan tertulis terlebih dahulu dari Toentoen.',
      },
    ],
  },
  {
    id: 'larangan-aktivitas',
    heading: '9. Larangan Aktivitas dan Barang Ilegal',
    content: [
      {
        type: 'paragraph',
        text: 'Pengguna dan/atau Merchant dilarang melakukan segala bentuk aktivitas ilegal atau menawarkan, menjual, membeli, serta mempromosikan barang dan/atau jasa yang dilarang oleh peraturan perundang-undangan yang berlaku di Indonesia, termasuk tapi tidak terbatas pada barang palsu, barang bajakan, narkotika, senjata api, obat-obatan terlarang, barang hasil curian, serta barang dan/atau jasa lain yang melanggar hukum.',
      },
    ],
  },
  {
    id: 'hukum-berlaku',
    heading: '10. Hukum yang Berlaku',
    content: [
      {
        type: 'paragraph',
        text: 'Syarat dan Ketentuan ini diatur, ditafsirkan, dan dilaksanakan berdasarkan hukum Negara Kesatuan Republik Indonesia. Anda setuju bahwa setiap perselisihan atau tindakan hukum apa pun yang mungkin timbul dari, berhubungan dengan, atau berada dalam cara apa pun yang berhubungan dengan penggunaan layanan akan terlebih dahulu diselesaikan secara musyawarah dan eksklusif untuk mencapai mufakat sebelum menempuh upaya penyelesaian melalui jalur hukum sesuai ketentuan peraturan perundang-undangan yang berlaku.',
      },
    ],
  },
  {
    id: 'perubahan-ketentuan',
    heading: '11. Perubahan Ketentuan',
    content: [
      {
        type: 'paragraph',
        text: 'Pengguna dan/atau Merchant menyetujui dan memahami bahwa Toentoen berhak untuk mengubah, memperbarui, atau menyesuaikan Syarat dan Ketentuan ini sewaktu-waktu sesuai kebutuhan dan ketentuan yang berlaku. Setiap perubahan akan berlaku efektif sejak diumumkan atau ditampilkan melalui aplikasi. Penggunaan layanan secara berkelanjutan setelah berlakunya perubahan tersebut dianggap sebagai bentuk persetujuan Pengguna terhadap Syarat dan Ketentuan yang telah diperbarui.',
      },
      {
        type: 'contact-box',
        items: [
          {
            label: 'Email Bantuan',
            value: 'support@toentoen.com',
            href: 'mailto:support@toentoen.com',
          },
          {
            label: 'Dokumen Terkait',
            value: 'Kebijakan Privasi Toentoen',
            href: '/privacy-policy',
          },
        ],
      },
    ],
  },
];
