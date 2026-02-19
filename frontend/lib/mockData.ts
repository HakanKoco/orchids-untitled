export interface Exercise {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: number; // minutes
  category: 'isinma' | 'nefes' | 'aksam';
  difficulty: 'kolay' | 'orta' | 'zor';
  steps: string[];
  warning?: string;
  color: string;
  colorLight: string;
  emoji: string;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  colorLight: string;
  exerciseCount: number;
}

export const CATEGORIES: Category[] = [
  {
    id: 'isinma',
    title: 'Isınma Hareketleri',
    description: 'Egzersiz öncesi kas gruplarını hazırlayan nazik hareketler',
    emoji: '🌅',
    color: '#1FA67A',
    colorLight: '#E8F7F2',
    exerciseCount: 4,
  },
  {
    id: 'nefes',
    title: 'Nefes Egzersizleri',
    description: 'Akciğer kapasitesini artıran rehberli nefes teknikleri',
    emoji: '🌬️',
    color: '#17A499',
    colorLight: '#E6F7F6',
    exerciseCount: 6,
  },
  {
    id: 'aksam',
    title: 'Akşam Rutini',
    description: 'Güne sakin bir kapanış için rahatlama ve toparlanma',
    emoji: '🌙',
    color: '#2563EB',
    colorLight: '#EFF6FF',
    exerciseCount: 3,
  },
];

export const EXERCISES: Exercise[] = [
  {
    id: 'isinma-1',
    title: 'Boyun Isınması',
    subtitle: '(Oturarak)',
    description:
      'Boyun kaslarını nazikçe gevşetin. Bu egzersiz solunum kaslarını hazırlamak ve genel kas gerginliğini azaltmak için tasarlanmıştır.',
    duration: 5,
    category: 'isinma',
    difficulty: 'kolay',
    steps: [
      'Sırtınızı düz tutarak rahat bir sandalyeye oturun.',
      'Başınızı yavaşça sağa çevirin, 5 saniye tutun.',
      'Başınızı merkeze getirin, sola çevirin, 5 saniye tutun.',
      'Başınızı yavaşça öne eğin, çeneyi göğse yaklaştırın.',
      'Bu hareketi her yönde 5 kez tekrarlayın.',
    ],
    warning:
      'Baş dönmesi ya da ağrı hissederseniz egzersizi durdurun ve dinlenin. Hareketleri ani yapmayın.',
    color: '#1FA67A',
    colorLight: '#E8F7F2',
    emoji: '🌿',
  },
  {
    id: 'isinma-2',
    title: 'Omuz Açma',
    subtitle: '(Ayakta)',
    description:
      'Omuz kaslarını ve üst sırtı nazikçe çalıştırarak solunum kapasitesini destekleyin.',
    duration: 7,
    category: 'isinma',
    difficulty: 'kolay',
    steps: [
      'Ayakta, omuz genişliğinde durun.',
      'Her iki omzunuzu kulak seviyesine kaldırın.',
      '3 saniye tutun, ardından aşağı bırakın.',
      'Omuzlarınızı geriye doğru çembere alın.',
      '10 tekrar yapın.',
    ],
    warning: 'Kalp çarpıntısı veya nefes darlığı hissederseniz durun ve oturun.',
    color: '#1FA67A',
    colorLight: '#E8F7F2',
    emoji: '🌱',
  },
  {
    id: 'nefes-1',
    title: 'Nefes Egzersizi I',
    subtitle: '(Diyafram Nefesi)',
    description:
      'Diyafram kasını güçlendiren temel nefes tekniği. Akciğer verimliliğini artırır ve oksijen alımını maksimuma çıkarır.',
    duration: 8,
    category: 'nefes',
    difficulty: 'kolay',
    steps: [
      'Sırt üstü yatın veya rahat bir sandalyeye oturun.',
      'Bir elinizi göğsünüze, diğerini karnınıza koyun.',
      'Burnunuzdan 4 saniye nefes alın; karnınızın yükseldiğini hissedin.',
      '2 saniye nefesi tutun.',
      'Ağzınızdan 6 saniye yavaşça nefes verin.',
      'Bu döngüyü 10 kez tekrarlayın.',
    ],
    warning:
      'Baş dönmesi hissederseniz normal nefesinize dönün ve egzersizi birkaç dakika sonra tekrar deneyin.',
    color: '#17A499',
    colorLight: '#E6F7F6',
    emoji: '🌬️',
  },
  {
    id: 'nefes-2',
    title: 'Nefes Egzersizi II',
    subtitle: '(Ayakta Olan)',
    description:
      'Ayakta yapılan bu ileri seviye nefes egzersizi akciğer kapasitesini artırır ve solunum kaslarını güçlendirir.',
    duration: 10,
    category: 'nefes',
    difficulty: 'orta',
    steps: [
      'Ayağa kalkın, omuzlarınızı geri çekin, göğsünüzü hafifçe öne açın.',
      'Burnunuzdan derin ve yavaş bir nefes alın (4 saniye).',
      'Nefesi üst akciğerlere doldurun, omuzlarınızı kaldırmadan göğsünüzü genişletin.',
      '2 saniye tutun.',
      'Büzülmüş dudaklar tekniğiyle 8 saniye boyunca nefes verin.',
      'Her setten sonra 1 dakika dinlenin. Toplam 3 set yapın.',
    ],
    warning:
      'Bu egzersiz ciddi KOAH semptomları olan kişiler için orta zorlukta olabilir. Doktorunuzun onayı olmadan yapmayın.',
    color: '#17A499',
    colorLight: '#E6F7F6',
    emoji: '💨',
  },
  {
    id: 'nefes-3',
    title: 'Büzük Dudak Nefesi',
    subtitle: '(Oturarak)',
    description:
      'Hava yollarını açık tutan bu teknik, nefes darlığını anında hafifletir ve temiz hava alımını kolaylaştırır.',
    duration: 5,
    category: 'nefes',
    difficulty: 'kolay',
    steps: [
      'Rahat bir pozisyonda oturun, omuzlarınızı gevşetin.',
      'Burnunuzdan 2 saniye nefes alın.',
      'Dudaklarınızı ıslık çalar gibi büzün.',
      'Bu pozisyonda 4 saniye yavaşça nefes verin.',
      'Günde birkaç kez, 10 tekrar yapın.',
    ],
    color: '#17A499',
    colorLight: '#E6F7F6',
    emoji: '🫧',
  },
  {
    id: 'aksam-1',
    title: 'Gece Rahatlama',
    subtitle: '(Yatarak)',
    description:
      'Vücudu uyku için hazırlayan ve solunum sistemini yatıştıran akşam nefes rutini.',
    duration: 10,
    category: 'aksam',
    difficulty: 'kolay',
    steps: [
      'Sırt üstü yatın, bacaklarınızı hafifçe açın.',
      'Gözlerinizi kapatın, kaslarınızı gevşetin.',
      'Derin, yavaş nefesler alın; her nefeste biraz daha gevşeyin.',
      '4-7-8 tekniğini uygulayın: 4 sayı nefes al, 7 sayı tut, 8 sayı ver.',
      '10 dakika boyunca sürdürün.',
    ],
    color: '#2563EB',
    colorLight: '#EFF6FF',
    emoji: '🌙',
  },
  {
    id: 'aksam-2',
    title: 'Günü Değerlendirme',
    subtitle: '(Meditasyon)',
    description:
      'Günün stresini bırakan, zihinsel netliği artıran rehberli dinginlik seansı.',
    duration: 8,
    category: 'aksam',
    difficulty: 'kolay',
    steps: [
      'Rahat bir pozisyon alın.',
      'Bugün yaptığınız egzersizleri zihinsel olarak listeleyin.',
      'Kendinize "bugün iyi iş çıkardım" deyin.',
      'Yavaş, derin nefesler alarak zihninizi boşaltın.',
      '8 dakika boyunca sadece nefesinize odaklanın.',
    ],
    color: '#2563EB',
    colorLight: '#EFF6FF',
    emoji: '⭐',
  },
];

export const ADMIN_STATS = [
  {
    id: '1',
    title: 'Toplam Egzersiz',
    value: 24,
    icon: '🏃',
    color: '#1FA67A',
    colorLight: '#E8F7F2',
    change: '+3 bu hafta',
  },
  {
    id: '2',
    title: 'Blog Yazısı',
    value: 12,
    icon: '📝',
    color: '#2563EB',
    colorLight: '#EFF6FF',
    change: '+1 bu hafta',
  },
  {
    id: '3',
    title: 'Kullanıcılar',
    value: 847,
    icon: '👥',
    color: '#7C3AED',
    colorLight: '#F5F3FF',
    change: '+28 bu ay',
  },
  {
    id: '4',
    title: 'Destek Talepleri',
    value: 5,
    icon: '🎧',
    color: '#EA580C',
    colorLight: '#FFF7ED',
    change: '2 beklemede',
  },
];

export const CONSENT_TEXT = `KOAH Rehabilitasyon Programı Bilgilendirme Formu

Bu uygulama, Kronik Obstrüktif Akciğer Hastalığı (KOAH) tanısı almış bireyler için tasarlanmış bir pulmoner rehabilitasyon destek aracıdır. Lütfen aşağıdaki bilgileri dikkatlice okuyunuz.

ÖNEMLI UYARILAR

Bu uygulama, tıbbi tedavinin yerini tutmaz. Tüm egzersizlere başlamadan önce doktorunuzun onayını almanız zorunludur. Egzersiz sırasında herhangi bir rahatsızlık, nefes darlığının ani artışı, göğüs ağrısı veya baş dönmesi yaşarsanız hemen durmalı ve sağlık profesyonelinize başvurmalısınız.

PROGRAMIN AMACI

Bu program; akciğer kapasitesini artırmaya, günlük yaşam aktivitelerindeki toleransı geliştirmeye, nefes darlığını yönetmeye ve yaşam kalitesini iyileştirmeye yönelik rehberli egzersizler sunmaktadır.

VERİ GİZLİLİĞİ

Kişisel sağlık verileriniz yalnızca cihazınızda saklanmaktadır. Hiçbir veri üçüncü taraflarla paylaşılmaz. Verileriniz şifrelenmiş formatta tutulur.

SORUMLULUK REDDİ

Uygulama geliştiricileri ve içerik sağlayıcıları, egzersizlerin yanlış uygulanmasından kaynaklanabilecek herhangi bir zarardan sorumlu tutulamaz. Program, yalnızca bireyin kendi sorumluluğunda kullanılmalıdır.

KATILıM ŞARTLARI

Programa katılmak için 18 yaşından büyük olmanız ve bir sağlık profesyoneli tarafından KOAH tanısı almış olmanız gerekmektedir.

KULLANIM KOŞULLARI

Bu uygulamayı kullanarak yukarıdaki koşulları kabul etmiş ve programı doktorunuzun önerisi doğrultusunda kullanacağınızı beyan etmiş olursunuz.`;
