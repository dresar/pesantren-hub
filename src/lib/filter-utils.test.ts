import { describe, it, expect } from 'vitest';
import { filterSantriData } from './filter-utils';
import { Santri } from '@/types';
describe('filterSantriData', () => {
  const mockData: Santri[] = [
    {
      id: '1',
      nama_lengkap: 'Ahmad',
      jenis_kelamin: 'L',
      status: 'verified',
      created_at: '2023-01-01T10:00:00Z',
    } as Santri,
    {
      id: '2',
      nama_lengkap: 'Siti',
      jenis_kelamin: 'P',
      status: 'pending',
      created_at: '2023-01-02T10:00:00Z',
    } as Santri,
    {
      id: '3',
      nama_lengkap: 'Budi',
      jenis_kelamin: 'L',
      status: 'pending',
      created_at: '2023-01-03T10:00:00Z',
    } as Santri,
  ];
  it('should return all data if filters are "all" and dates are empty', () => {
    const result = filterSantriData(mockData, 'all', 'all', '', '');
    expect(result).toHaveLength(3);
  });
  it('should filter by status', () => {
    const result = filterSantriData(mockData, 'pending', 'all', '', '');
    expect(result).toHaveLength(2);
    expect(result.map(s => s.nama_lengkap)).toContain('Siti');
    expect(result.map(s => s.nama_lengkap)).toContain('Budi');
  });
  it('should filter by gender', () => {
    const result = filterSantriData(mockData, 'all', 'P', '', '');
    expect(result).toHaveLength(1);
    expect(result[0].nama_lengkap).toBe('Siti');
  });
  it('should filter by date range', () => {
    const result = filterSantriData(mockData, 'all', 'all', '2023-01-02', '2023-01-02');
    expect(result).toHaveLength(1);
    expect(result[0].nama_lengkap).toBe('Siti');
  });
  it('should combine filters', () => {
    const result = filterSantriData(mockData, 'pending', 'L', '', '');
    expect(result).toHaveLength(1);
    expect(result[0].nama_lengkap).toBe('Budi');
  });
  it('should handle empty data', () => {
    const result = filterSantriData(undefined, 'all', 'all', '', '');
    expect(result).toEqual([]);
  });
});