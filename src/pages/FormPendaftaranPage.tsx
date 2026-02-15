import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, PartyPopper, Loader2, AlertCircle } from 'lucide-react';
import StepperForm from '@/components/forms/StepperForm';
import UploadField from '@/components/forms/UploadField';
import { FormPendaftaranData, initialFormData } from '@/types/form';
import { useSubmitRegistration, useSantriRegistrationStatus } from '@/hooks/use-santri';
import { toast } from 'sonner';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
const steps = [
  { label: 'Data Santri', shortLabel: 'Santri' },
  { label: 'Data Orang Tua', shortLabel: 'Ortu' },
  { label: 'Pendidikan', shortLabel: 'Pendidikan' },
  { label: 'Minat & Bakat', shortLabel: 'Minat' },
  { label: 'Dokumen', shortLabel: 'Dokumen' },
  { label: 'Review', shortLabel: 'Review' },
];
const inputClass =
  'w-full px-4 py-2.5 text-sm rounded-lg bg-secondary border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors';
const santriSchema = z.object({
  namaLengkap: z.string().min(3, 'Nama lengkap wajib diisi'),
  namaPanggilan: z.string().min(1, 'Nama panggilan wajib diisi'),
  nisn: z.string().min(10, 'NISN minimal 10 digit').regex(/^\d+$/, 'NISN harus berupa angka'),
  tempatLahir: z.string().min(1, 'Tempat lahir wajib diisi'),
  tanggalLahir: z.string().min(1, 'Tanggal lahir wajib diisi'),
  jenisKelamin: z.enum(['laki-laki', 'perempuan', ''], { required_error: 'Pilih jenis kelamin' }).refine((val) => val !== '', 'Pilih jenis kelamin'),
  alamat: z.string().min(5, 'Alamat wajib diisi lengkap'),
});
const orangTuaSchema = z.object({
  namaAyah: z.string().min(1, 'Nama ayah wajib diisi'),
  namaIbu: z.string().min(1, 'Nama ibu wajib diisi'),
  pekerjaanAyah: z.string().min(1, 'Pekerjaan ayah wajib diisi'),
  pekerjaanIbu: z.string().min(1, 'Pekerjaan ibu wajib diisi'),
  noWhatsapp: z.string().min(10, 'Nomor WhatsApp tidak valid').regex(/^\d+$/, 'Nomor harus berupa angka'),
  alamatOrangTua: z.string().min(5, 'Alamat orang tua wajib diisi'),
});
const pendidikanSchema = z.object({
  namaSekolah: z.string().min(1, 'Nama sekolah asal wajib diisi'),
  tahunLulus: z.string().regex(/^\d{4}$/, 'Tahun lulus harus 4 digit angka'),
  nilaiRataRata: z.string().regex(/^\d+(\.\d+)?$/, 'Nilai harus berupa angka (contoh: 85.5)'),
});
const tambahanSchema = z.object({
  prestasi: z.string().optional(),
  hobi: z.string().optional(),
  keahlian: z.string().optional(),
});
const dokumenSchema = z.object({
  akteLahir: z.instanceof(File, { message: 'Akte Kelahiran wajib diupload' }).nullable().refine((val) => val !== null, 'Akte Kelahiran wajib diupload'),
  kartuKeluarga: z.instanceof(File, { message: 'Kartu Keluarga wajib diupload' }).nullable().refine((val) => val !== null, 'Kartu Keluarga wajib diupload'),
  pasFoto: z.instanceof(File, { message: 'Pas Foto wajib diupload' }).nullable().refine((val) => val !== null, 'Pas Foto wajib diupload'),
  ijazah: z.any().optional(), 
});
const FormPendaftaranPage = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [data, setData] = useState<FormPendaftaranData>(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const submitMutation = useSubmitRegistration();
  const { data: existingStatus, isLoading: isLoadingStatus } = useSantriRegistrationStatus();
  useEffect(() => {
    if (existingStatus?.status && existingStatus.status !== 'draft') {
        setSubmitted(true);
    }
  }, [existingStatus]);
  const update = <K extends keyof FormPendaftaranData>(
    section: K,
    field: keyof FormPendaftaranData[K],
    value: any
  ) => {
    setData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
    if (errors[field as string]) {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field as string];
            return newErrors;
        });
    }
  };
  const validateStep = (stepIndex: number) => {
    try {
      if (stepIndex === 0) santriSchema.parse(data.santri);
      if (stepIndex === 1) orangTuaSchema.parse(data.orangTua);
      if (stepIndex === 2) pendidikanSchema.parse(data.pendidikan);
      if (stepIndex === 3) tambahanSchema.parse(data.tambahan);
      if (stepIndex === 4) dokumenSchema.parse(data.dokumen);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
        toast.error('Mohon lengkapi data yang wajib diisi.');
      }
      return false;
    }
  };
  const next = () => {
    if (validateStep(current)) {
        setCurrent((p) => Math.min(p + 1, steps.length - 1));
    }
  };
  const prev = () => setCurrent((p) => Math.max(p - 1, 0));
  const handleSubmit = async () => {
    if (!validateStep(4)) return; 
    try {
      await submitMutation.mutateAsync(data);
      setSubmitted(true);
      toast.success('Pendaftaran berhasil dikirim!');
      setTimeout(() => navigate('/app/status'), 2000);
    } catch (error: any) {
      console.error(error);
      const msg = error?.response?.data?.error || 'Gagal mengirim pendaftaran. Silakan coba lagi.';
      toast.error(msg);
    }
  };
  if (isLoadingStatus) {
      return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }
  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto text-center py-12"
      >
        <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6">
          <PartyPopper className="w-10 h-10 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Pendaftaran Berhasil! 🎉</h2>
        <p className="text-muted-foreground mb-2">
          Alhamdulillah, formulir pendaftaran Anda telah berhasil dikirim.
        </p>
        <p className="text-sm text-muted-foreground">
          Tim kami akan memverifikasi data dan menghubungi Anda melalui WhatsApp dalam 1-3 hari kerja.
        </p>
        <div className="mt-8 flex justify-center">
            <button onClick={() => navigate('/app/status')} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                Cek Status Pendaftaran
            </button>
        </div>
      </motion.div>
    );
  }
  return (
    <div className="max-w-3xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-xl md:text-2xl font-bold mb-1">Formulir Pendaftaran Santri Baru</h1>
        <p className="text-sm text-muted-foreground">Tahun Ajaran 2026/2027</p>
      </div>
      <div className="mb-8">
        <StepperForm steps={steps} currentStep={current} />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="glass-card p-5 md:p-8"
        >
          {current === 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-4">Data Santri</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Input label="Nama Lengkap" value={data.santri.namaLengkap} onChange={(v) => update('santri', 'namaLengkap', v)} error={errors.namaLengkap} />
                </div>
                <div>
                  <Input label="Nama Panggilan" value={data.santri.namaPanggilan} onChange={(v) => update('santri', 'namaPanggilan', v)} error={errors.namaPanggilan} />
                </div>
                <div>
                  <Input label="NISN" value={data.santri.nisn} onChange={(v) => update('santri', 'nisn', v)} error={errors.nisn} placeholder="10 digit angka" />
                </div>
                <div>
                  <Input label="Tempat Lahir" value={data.santri.tempatLahir} onChange={(v) => update('santri', 'tempatLahir', v)} error={errors.tempatLahir} />
                </div>
                <div>
                  <Input label="Tanggal Lahir" type="date" value={data.santri.tanggalLahir} onChange={(v) => update('santri', 'tanggalLahir', v)} error={errors.tanggalLahir} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Jenis Kelamin</label>
                  <select 
                    className={`${inputClass} ${errors.jenisKelamin ? 'border-destructive ring-destructive/20' : ''}`}
                    value={data.santri.jenisKelamin} 
                    onChange={(e) => update('santri', 'jenisKelamin', e.target.value)}
                  >
                    <option value="">Pilih</option>
                    <option value="laki-laki">Laki-laki</option>
                    <option value="perempuan">Perempuan</option>
                  </select>
                  {errors.jenisKelamin && <p className="text-xs text-destructive mt-1">{errors.jenisKelamin}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-1.5 block">Alamat Lengkap</label>
                  <textarea 
                    className={`${inputClass} min-h-[80px] resize-none ${errors.alamat ? 'border-destructive ring-destructive/20' : ''}`}
                    value={data.santri.alamat} 
                    onChange={(e) => update('santri', 'alamat', e.target.value)} 
                    placeholder="Jl. ..." 
                  />
                  {errors.alamat && <p className="text-xs text-destructive mt-1">{errors.alamat}</p>}
                </div>
              </div>
            </div>
          )}
          {current === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-4">Data Orang Tua / Wali</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Nama Ayah" value={data.orangTua.namaAyah} onChange={(v) => update('orangTua', 'namaAyah', v)} error={errors.namaAyah} />
                <Input label="Pekerjaan Ayah" value={data.orangTua.pekerjaanAyah} onChange={(v) => update('orangTua', 'pekerjaanAyah', v)} error={errors.pekerjaanAyah} />
                <Input label="Nama Ibu" value={data.orangTua.namaIbu} onChange={(v) => update('orangTua', 'namaIbu', v)} error={errors.namaIbu} />
                <Input label="Pekerjaan Ibu" value={data.orangTua.pekerjaanIbu} onChange={(v) => update('orangTua', 'pekerjaanIbu', v)} error={errors.pekerjaanIbu} />
                <Input label="No. WhatsApp" value={data.orangTua.noWhatsapp} onChange={(v) => update('orangTua', 'noWhatsapp', v)} error={errors.noWhatsapp} placeholder="08xxxxxxxxxx" />
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-1.5 block">Alamat Orang Tua</label>
                  <textarea 
                    className={`${inputClass} min-h-[80px] resize-none ${errors.alamatOrangTua ? 'border-destructive ring-destructive/20' : ''}`}
                    value={data.orangTua.alamatOrangTua} 
                    onChange={(e) => update('orangTua', 'alamatOrangTua', e.target.value)} 
                    placeholder="Alamat lengkap" 
                  />
                  {errors.alamatOrangTua && <p className="text-xs text-destructive mt-1">{errors.alamatOrangTua}</p>}
                </div>
              </div>
            </div>
          )}
          {current === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-4">Pendidikan Sebelumnya</h3>
              <Input label="Nama Sekolah Asal" value={data.pendidikan.namaSekolah} onChange={(v) => update('pendidikan', 'namaSekolah', v)} error={errors.namaSekolah} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Tahun Lulus" value={data.pendidikan.tahunLulus} onChange={(v) => update('pendidikan', 'tahunLulus', v)} error={errors.tahunLulus} placeholder="YYYY" />
                <Input label="Nilai Rata-rata" value={data.pendidikan.nilaiRataRata} onChange={(v) => update('pendidikan', 'nilaiRataRata', v)} error={errors.nilaiRataRata} placeholder="85.5" />
              </div>
            </div>
          )}
          {current === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-4">Minat & Bakat (Opsional)</h3>
              <div className="space-y-4">
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-1.5 block">Prestasi Akademik / Non-Akademik</label>
                  <textarea 
                    className={`${inputClass} min-h-[80px] resize-none`}
                    value={data.tambahan.prestasi} 
                    onChange={(e) => update('tambahan', 'prestasi', e.target.value)} 
                    placeholder="Contoh: Juara 1 Lomba Adzan Tingkat Kabupaten" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-1.5 block">Hobi</label>
                  <input className={inputClass} value={data.tambahan.hobi} onChange={(e) => update('tambahan', 'hobi', e.target.value)} placeholder="Contoh: Membaca, Futsal" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-1.5 block">Keahlian Khusus</label>
                  <input className={inputClass} value={data.tambahan.keahlian} onChange={(e) => update('tambahan', 'keahlian', e.target.value)} placeholder="Contoh: Desain Grafis, Tahfidz 5 Juz" />
                </div>
              </div>
            </div>
          )}
          {current === 4 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-4">Upload Dokumen</h3>
              <p className="text-sm text-muted-foreground mb-4">Upload dokumen persyaratan. Format: PDF, JPG, PNG (maks. 2MB).</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <UploadField label="Akte Kelahiran" onFileSelect={(n) => update('dokumen', 'akteLahir', n)} />
                    {errors.akteLahir && <p className="text-xs text-destructive">{errors.akteLahir}</p>}
                </div>
                <div className="space-y-1">
                    <UploadField label="Kartu Keluarga" onFileSelect={(n) => update('dokumen', 'kartuKeluarga', n)} />
                    {errors.kartuKeluarga && <p className="text-xs text-destructive">{errors.kartuKeluarga}</p>}
                </div>
                <div className="space-y-1">
                    <UploadField label="Pas Foto 3x4" accept=".jpg,.png" onFileSelect={(n) => update('dokumen', 'pasFoto', n)} />
                    {errors.pasFoto && <p className="text-xs text-destructive">{errors.pasFoto}</p>}
                </div>
                <UploadField label="Ijazah / SKL (Jika ada)" onFileSelect={(n) => update('dokumen', 'ijazah', n)} />
              </div>
            </div>
          )}
          {current === 5 && (
            <div className="space-y-6">
              <h3 className="font-semibold text-lg mb-4">Review Data Pendaftaran</h3>
              <ReviewSection title="Data Santri">
                <ReviewRow label="Nama Lengkap" value={data.santri.namaLengkap} />
                <ReviewRow label="Nama Panggilan" value={data.santri.namaPanggilan} />
                <ReviewRow label="Tempat, Tanggal Lahir" value={`${data.santri.tempatLahir}, ${data.santri.tanggalLahir}`} />
                <ReviewRow label="Jenis Kelamin" value={data.santri.jenisKelamin} />
                <ReviewRow label="NISN" value={data.santri.nisn} />
                <ReviewRow label="Alamat" value={data.santri.alamat} />
              </ReviewSection>
              <ReviewSection title="Data Orang Tua">
                <ReviewRow label="Nama Ayah" value={data.orangTua.namaAyah} />
                <ReviewRow label="Pekerjaan Ayah" value={data.orangTua.pekerjaanAyah} />
                <ReviewRow label="Nama Ibu" value={data.orangTua.namaIbu} />
                <ReviewRow label="Pekerjaan Ibu" value={data.orangTua.pekerjaanIbu} />
                <ReviewRow label="No. WhatsApp" value={data.orangTua.noWhatsapp} />
              </ReviewSection>
              <ReviewSection title="Pendidikan & Minat">
                <ReviewRow label="Sekolah Asal" value={data.pendidikan.namaSekolah} />
                <ReviewRow label="Tahun Lulus" value={data.pendidikan.tahunLulus} />
                <ReviewRow label="Nilai Rata-rata" value={data.pendidikan.nilaiRataRata} />
                <ReviewRow label="Prestasi" value={data.tambahan.prestasi} />
                <ReviewRow label="Hobi" value={data.tambahan.hobi} />
              </ReviewSection>
              <ReviewSection title="Dokumen">
                <ReviewRow label="Akte Kelahiran" value={data.dokumen.akteLahir?.name || '—'} />
                <ReviewRow label="Kartu Keluarga" value={data.dokumen.kartuKeluarga?.name || '—'} />
                <ReviewRow label="Pas Foto" value={data.dokumen.pasFoto?.name || '—'} />
                <ReviewRow label="Ijazah" value={data.dokumen.ijazah?.name || '—'} />
              </ReviewSection>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      {}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={prev}
          disabled={current === 0 || submitMutation.isPending}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border border-border hover:bg-secondary transition-colors disabled:opacity-30 disabled:pointer-events-none"
        >
          <ArrowLeft className="w-4 h-4" /> Sebelumnya
        </button>
        {current < steps.length - 1 ? (
          <button
            onClick={next}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg gradient-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Selanjutnya <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitMutation.isPending}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg gradient-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            {submitMutation.isPending ? 'Mengirim...' : 'Kirim Pendaftaran'}
          </button>
        )}
      </div>
    </div>
  );
};
const Input = ({ label, value, onChange, error, type = 'text', placeholder }: any) => (
  <div>
    <label className="text-sm font-medium mb-1.5 block">{label}</label>
    <input 
      type={type}
      className={`${inputClass} ${error ? 'border-destructive ring-destructive/20' : ''}`}
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      placeholder={placeholder} 
    />
    {error && <p className="text-xs text-destructive mt-1">{error}</p>}
  </div>
);
const ReviewSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="p-4 rounded-lg bg-secondary">
    <h4 className="text-sm font-semibold text-primary mb-3">{title}</h4>
    <div className="space-y-2">{children}</div>
  </div>
);
const ReviewRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start justify-between gap-4 text-sm">
    <span className="text-muted-foreground shrink-0">{label}</span>
    <span className="font-medium text-right">{value || '—'}</span>
  </div>
);
export default FormPendaftaranPage;