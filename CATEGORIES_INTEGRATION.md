# Environment Variables Setup

Pastikan file `.env.local` di root folder frontend sudah berisi:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Sesuaikan dengan port backend yang sedang berjalan.

## Cara Test Categories Integration

1. **Pastikan backend running** di `http://localhost:8000`
2. **Pastikan database sudah ada data categories**
3. **Restart frontend dev server** jika baru menambahkan env variable
4. **Buka browser** dan cek landing page
5. **Lihat Network tab** di DevTools untuk melihat API call ke `/api/categories`

## Expected Behavior

- **Loading State**: Skeleton loading saat fetch data
- **Success State**: Menampilkan categories dari database
- **Error State**: Menampilkan error message + tombol "Try Again"
- **Empty State**: Menampilkan "No categories available"

## Troubleshooting

### Categories tidak muncul?
1. Cek console browser untuk error
2. Cek Network tab untuk response API
3. Pastikan backend endpoint `/api/categories` bisa diakses
4. Cek CORS settings di backend

### CORS Error?
Backend sudah di-setup untuk allow `http://localhost:3000` di `index.ts`:
```typescript
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
```
