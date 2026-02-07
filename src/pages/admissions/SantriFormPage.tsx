import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  GraduationCap,
  Save,
  ArrowLeft,
  User,
  Users,
  MapPin,
  School,
  FileText,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';

const santriFormSchema = z.object({
  // Personal Data
  nama_lengkap: z.string().min(3, 'Nama minimal 3 karakter'),
  nama_panggilan: z.string().min(1, 'Nama panggilan wajib diisi'),
  nisn: z.string().length(10, 'NISN harus 10 digit'),
  tempat_lahir: z.string().min(1, 'Tempat lahir wajib diisi'),
  tanggal_lahir: z.string().min(1, 'Tanggal lahir wajib diisi'),
  jenis_kelamin: z.enum(['L', 'P'], { required_error: 'Pilih jenis kelamin' }),
  agama: z.string().default('Islam'),
  kewarganegaraan: z.string().default('WNI'),
  anak_ke: z.coerce.number().min(1).optional(),
  jumlah_saudara: z.coerce.number().min(0).optional(),
  bahasa_sehari_hari: z.string().optional(),
  golongan_darah: z.string().optional(),
  tinggi_badan: z.coerce.number().optional(),
  berat_badan: z.coerce.number().optional(),
  riwayat_penyakit: z.string().optional(),
  tinggal_dengan: z.string().optional(),

  // Parent - Father
  nama_ayah: z.string().min(1, 'Nama ayah wajib diisi'),
  nik_ayah: z.string().optional(),
  pendidikan_ayah: z.string().optional(),
  pekerjaan_ayah: z.string().optional(),
  no_hp_ayah: z.string().optional(),
  status_ayah: z.string().default('Hidup'),

  // Parent - Mother
  nama_ibu: z.string().min(1, 'Nama ibu wajib diisi'),
  nik_ibu: z.string().optional(),
  pendidikan_ibu: z.string().optional(),
  pekerjaan_ibu: z.string().optional(),
  no_hp_ibu: z.string().optional(),
  status_ibu: z.string().default('Hidup'),

  // Address
  alamat: z.string().min(1, 'Alamat wajib diisi'),
  desa: z.string().optional(),
  kecamatan: z.string().optional(),
  kabupaten: z.string().optional(),
  provinsi: z.string().optional(),
  kode_pos: z.string().optional(),
  no_hp: z.string().optional(),
  email: z.string().email('Email tidak valid').optional().or(z.literal('')),

  // School Origin
  asal_sekolah: z.string().min(1, 'Asal sekolah wajib diisi'),
  npsn_sekolah: z.string().optional(),
  kelas_terakhir: z.string().optional(),
  tahun_lulus: z.string().optional(),
  no_ijazah: z.string().optional(),
});

type SantriFormValues = z.infer<typeof santriFormSchema>;

export default function SantriFormPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SantriFormValues>({
    resolver: zodResolver(santriFormSchema),
    defaultValues: {
      agama: 'Islam',
      kewarganegaraan: 'WNI',
      status_ayah: 'Hidup',
      status_ibu: 'Hidup',
    },
  });

  const onSubmit = async (values: SantriFormValues) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Form values:', values);
      toast.success('Data santri berhasil disimpan');
      navigate('/admissions');
    } catch (error) {
      toast.error('Gagal menyimpan data santri');
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Data Pribadi', icon: User },
    { id: 'parents', label: 'Data Orang Tua', icon: Users },
    { id: 'address', label: 'Alamat', icon: MapPin },
    { id: 'school', label: 'Asal Sekolah', icon: School },
    { id: 'documents', label: 'Dokumen', icon: FileText },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Tambah Santri Baru"
        description="Formulir pendaftaran santri baru"
        icon={GraduationCap}
      >
        <Button variant="outline" onClick={() => navigate('/admissions')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>
      </PageHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-flex">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id} className="gap-2">
                  <tab.icon className="h-4 w-4 hidden sm:block" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Personal Data Tab */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Data Pribadi Santri</CardTitle>
                  <CardDescription>
                    Informasi dasar calon santri
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="nama_lengkap"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Nama Lengkap *</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan nama lengkap" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nama_panggilan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Panggilan *</FormLabel>
                        <FormControl>
                          <Input placeholder="Nama panggilan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nisn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NISN *</FormLabel>
                        <FormControl>
                          <Input placeholder="10 digit NISN" maxLength={10} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tempat_lahir"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tempat Lahir *</FormLabel>
                        <FormControl>
                          <Input placeholder="Kota/Kabupaten" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tanggal_lahir"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tanggal Lahir *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="jenis_kelamin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jenis Kelamin *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih jenis kelamin" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="L">Laki-laki</SelectItem>
                            <SelectItem value="P">Perempuan</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="golongan_darah"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Golongan Darah</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih golongan darah" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="A">A</SelectItem>
                            <SelectItem value="B">B</SelectItem>
                            <SelectItem value="AB">AB</SelectItem>
                            <SelectItem value="O">O</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="anak_ke"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Anak Ke</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} placeholder="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="jumlah_saudara"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jumlah Saudara</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tinggi_badan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tinggi Badan (cm)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="150" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="berat_badan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Berat Badan (kg)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="45" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="riwayat_penyakit"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Riwayat Penyakit</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tuliskan riwayat penyakit jika ada, atau kosongkan jika tidak ada"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Parents Tab */}
            <TabsContent value="parents">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Father */}
                <Card>
                  <CardHeader>
                    <CardTitle>Data Ayah</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="nama_ayah"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Lengkap Ayah *</FormLabel>
                          <FormControl>
                            <Input placeholder="Nama lengkap ayah" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nik_ayah"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>NIK Ayah</FormLabel>
                          <FormControl>
                            <Input placeholder="16 digit NIK" maxLength={16} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pendidikan_ayah"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pendidikan Terakhir</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih pendidikan" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="SD">SD/MI</SelectItem>
                              <SelectItem value="SMP">SMP/MTs</SelectItem>
                              <SelectItem value="SMA">SMA/MA/SMK</SelectItem>
                              <SelectItem value="D3">D3</SelectItem>
                              <SelectItem value="S1">S1</SelectItem>
                              <SelectItem value="S2">S2</SelectItem>
                              <SelectItem value="S3">S3</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pekerjaan_ayah"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pekerjaan</FormLabel>
                          <FormControl>
                            <Input placeholder="Pekerjaan ayah" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="no_hp_ayah"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>No. HP</FormLabel>
                          <FormControl>
                            <Input placeholder="08xxxxxxxxxx" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status_ayah"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Hidup">Hidup</SelectItem>
                              <SelectItem value="Meninggal">Meninggal</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Mother */}
                <Card>
                  <CardHeader>
                    <CardTitle>Data Ibu</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="nama_ibu"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Lengkap Ibu *</FormLabel>
                          <FormControl>
                            <Input placeholder="Nama lengkap ibu" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nik_ibu"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>NIK Ibu</FormLabel>
                          <FormControl>
                            <Input placeholder="16 digit NIK" maxLength={16} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pendidikan_ibu"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pendidikan Terakhir</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih pendidikan" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="SD">SD/MI</SelectItem>
                              <SelectItem value="SMP">SMP/MTs</SelectItem>
                              <SelectItem value="SMA">SMA/MA/SMK</SelectItem>
                              <SelectItem value="D3">D3</SelectItem>
                              <SelectItem value="S1">S1</SelectItem>
                              <SelectItem value="S2">S2</SelectItem>
                              <SelectItem value="S3">S3</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pekerjaan_ibu"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pekerjaan</FormLabel>
                          <FormControl>
                            <Input placeholder="Pekerjaan ibu" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="no_hp_ibu"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>No. HP</FormLabel>
                          <FormControl>
                            <Input placeholder="08xxxxxxxxxx" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status_ibu"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Hidup">Hidup</SelectItem>
                              <SelectItem value="Meninggal">Meninggal</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Address Tab */}
            <TabsContent value="address">
              <Card>
                <CardHeader>
                  <CardTitle>Alamat Santri</CardTitle>
                  <CardDescription>Alamat tempat tinggal santri saat ini</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="alamat"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Alamat Lengkap *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Jl. Nama Jalan No. XX, RT/RW"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="desa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Desa/Kelurahan</FormLabel>
                        <FormControl>
                          <Input placeholder="Nama desa/kelurahan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="kecamatan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kecamatan</FormLabel>
                        <FormControl>
                          <Input placeholder="Nama kecamatan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="kabupaten"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kabupaten/Kota</FormLabel>
                        <FormControl>
                          <Input placeholder="Nama kabupaten/kota" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="provinsi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Provinsi</FormLabel>
                        <FormControl>
                          <Input placeholder="Nama provinsi" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="kode_pos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kode Pos</FormLabel>
                        <FormControl>
                          <Input placeholder="12345" maxLength={5} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="no_hp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>No. HP Santri</FormLabel>
                        <FormControl>
                          <Input placeholder="08xxxxxxxxxx" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="email@contoh.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* School Origin Tab */}
            <TabsContent value="school">
              <Card>
                <CardHeader>
                  <CardTitle>Asal Sekolah</CardTitle>
                  <CardDescription>Informasi sekolah sebelumnya</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="asal_sekolah"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Nama Sekolah Asal *</FormLabel>
                        <FormControl>
                          <Input placeholder="SDN/MI/SD ..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="npsn_sekolah"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NPSN Sekolah</FormLabel>
                        <FormControl>
                          <Input placeholder="8 digit NPSN" {...field} />
                        </FormControl>
                        <FormDescription>Nomor Pokok Sekolah Nasional</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="kelas_terakhir"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kelas Terakhir</FormLabel>
                        <FormControl>
                          <Input placeholder="6" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tahun_lulus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tahun Lulus</FormLabel>
                        <FormControl>
                          <Input placeholder="2024" maxLength={4} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="no_ijazah"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nomor Ijazah</FormLabel>
                        <FormControl>
                          <Input placeholder="DN-01 Dd xxxxxxx" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Dokumen Persyaratan</CardTitle>
                  <CardDescription>
                    Upload dokumen yang diperlukan untuk pendaftaran
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                      { id: 'foto_santri', label: 'Foto Santri (3x4)', desc: 'Foto formal berlatar merah/biru' },
                      { id: 'foto_ktp', label: 'KTP Orang Tua', desc: 'Scan KTP ayah/ibu' },
                      { id: 'foto_akta', label: 'Akta Kelahiran', desc: 'Scan akta kelahiran santri' },
                      { id: 'foto_ijazah', label: 'Ijazah', desc: 'Scan ijazah terakhir' },
                      { id: 'surat_sehat', label: 'Surat Sehat', desc: 'Surat keterangan sehat dari dokter' },
                    ].map((doc) => (
                      <div
                        key={doc.id}
                        className="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                      >
                        <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="font-medium text-sm">{doc.label}</p>
                        <p className="text-xs text-muted-foreground mt-1">{doc.desc}</p>
                        <Input
                          type="file"
                          accept="image/*,.pdf"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Format yang didukung: JPG, PNG, PDF. Maksimal 2MB per file.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admissions')}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Simpan Data
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
