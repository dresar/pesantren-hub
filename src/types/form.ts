export interface DataSantri {
  namaLengkap: string;
  namaPanggilan: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: 'laki-laki' | 'perempuan' | '';
  alamat: string;
  nisn: string;
}
export interface DataOrangTua {
  namaAyah: string;
  namaIbu: string;
  pekerjaanAyah: string;
  pekerjaanIbu: string;
  noWhatsapp: string;
  alamatOrangTua: string;
}
export interface DataPendidikan {
  namaSekolah: string;
  tahunLulus: string;
  nilaiRataRata: string;
}
export interface DataTambahan {
  prestasi: string;
  hobi: string;
  keahlian: string;
}
export interface DataDokumen {
  akteLahir: File | null;
  kartuKeluarga: File | null;
  pasFoto: File | null;
  ijazah: File | null;
}
export interface FormPendaftaranData {
  santri: DataSantri;
  orangTua: DataOrangTua;
  pendidikan: DataPendidikan;
  tambahan: DataTambahan;
  dokumen: DataDokumen;
}
export const initialFormData: FormPendaftaranData = {
  santri: {
    namaLengkap: '',
    namaPanggilan: '',
    tempatLahir: '',
    tanggalLahir: '',
    jenisKelamin: '',
    alamat: '',
    nisn: '',
  },
  orangTua: {
    namaAyah: '',
    namaIbu: '',
    pekerjaanAyah: '',
    pekerjaanIbu: '',
    noWhatsapp: '',
    alamatOrangTua: '',
  },
  pendidikan: {
    namaSekolah: '',
    tahunLulus: '',
    nilaiRataRata: '',
  },
  tambahan: {
    prestasi: '',
    hobi: '',
    keahlian: '',
  },
  dokumen: {
    akteLahir: null,
    kartuKeluarga: null,
    pasFoto: null,
    ijazah: null,
  },
};