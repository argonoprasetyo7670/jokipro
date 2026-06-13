# 🤖 Fitur 13: AI Agent Worker

## Deskripsi

AI Agent Worker adalah sistem otomatis yang berperan sebagai Worker di platform EduTasky. Agent ini menggunakan **OpenAI GPT-4o** untuk menganalisis tugas, menulis cover letter, dan mengerjakan tugas dari mahasiswa secara otomatis.

## Keputusan Desain

| Aspek | Keputusan |
|-------|-----------|
| **Target** | Mahasiswa |
| **Kategori** | Penulisan Akademik, Programming, Analisis Data, Tugas Kuliah, Skripsi |
| **Output** | Content markdown di chat workspace |
| **Otonomi** | Semi-Auto (bid otomatis, hasil di-review admin) |
| **Identitas** | Tampil sebagai worker biasa |
| **Pricing** | Fixed rate per kategori |
| **LLM** | OpenAI GPT-4o |
| **Trigger** | Event-driven (saat tugas baru dibuat) |
| **Revisi** | Auto-revisi via LLM + admin review |

## File Terkait

### Agent Core (`lib/agent/`)

| File | Fungsi |
|------|--------|
| `config.ts` | Konfigurasi agent (nama, pricing, spesialisasi, LLM) |
| `types.ts` | TypeScript type definitions |
| `llm.ts` | OpenAI integration wrapper + cost tracking |
| `logger.ts` | Activity logger ke AgentLog table |
| `scanner.ts` | Scan tugas OPEN sesuai spesialisasi |
| `analyzer.ts` | Analisis tugas via LLM (feasibility, harga, estimasi) |
| `bidder.ts` | Generate cover letter + submit bid |
| `executor.ts` | Kerjakan tugas per kategori (writing, coding, data) |
| `orchestrator.ts` | Pipeline utama: scan → analyze → bid → execute → submit |

### API Routes

| Route | Method | Fungsi |
|-------|--------|--------|
| `/api/agent/run` | POST | Trigger agent cycle (admin/cron) |
| `/api/agent/status` | GET | Status agent + stats + recent logs |

### Server Actions

| Action | Fungsi |
|--------|--------|
| `getAgentDrafts()` | Ambil draft pending untuk admin review |
| `approveAgentDraft(id)` | Approve + eksekusi draft (bid/result) |
| `rejectAgentDraft(id, note)` | Tolak draft dengan catatan |

### Admin Dashboard

| File | Fungsi |
|------|--------|
| `app/dashboard/admin-keren/agent/page.tsx` | Server component halaman agent |
| `app/dashboard/admin-keren/agent/agent-client.tsx` | Client component: stats, drafts, logs |

## Database Models

```prisma
model AgentLog {
  id        String   @id @default(cuid())
  taskId    String?
  action    String   // "SCAN", "ANALYZE", "BID", "EXECUTE", "SUBMIT", "REVISE"
  status    String   // "SUCCESS", "FAILED", "SKIPPED"
  details   String?  @db.Text
  tokens    Int?     // LLM tokens consumed
  cost      Float?   // Estimated cost in USD
  createdAt DateTime @default(now())
}

model AgentDraft {
  id          String   @id @default(cuid())
  taskId      String
  orderId     String?
  type        String   // "BID" or "RESULT"
  content     String   @db.Text
  analysis    Json?
  fileUrl     String?
  approved    Boolean  @default(false)
  rejected    Boolean  @default(false)
  reviewedBy  String?
  reviewNote  String?  @db.Text
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Agent Workflow

```
Client Membuat Tugas Baru
        ↓ (Event Trigger)
🤖 Agent Cycle Dimulai
        ↓
[1] SCAN — Cari tugas OPEN sesuai spesialisasi
        ↓
[2] ANALYZE — LLM menilai: bisa dikerjakan? berapa harga?
        ↓ (Skip jika tidak bisa)
[3] BID — LLM generate cover letter → Submit bid
        ↓ (Menunggu client accept)
[4] EXECUTE — LLM kerjakan tugas sesuai kategori
        ↓
[5] DRAFT — Simpan hasil untuk admin review
        ↓
[6] ADMIN REVIEW — Approve / Reject
        ↓ (Jika approve)
[7] SUBMIT — Kirim hasil ke client via chat
        ↓
[8] CLIENT REVIEW — Accept / Revisi
        ↓ (Jika revisi)
[9] AUTO-REVISE — LLM baca feedback, perbaiki, simpan draft
```

## Fixed Pricing

| Kategori | Harga | Estimasi Hari |
|----------|-------|---------------|
| Penulisan Artikel | Rp 50.000 | 2 hari |
| Tugas Kuliah | Rp 75.000 | 2 hari |
| Programming | Rp 100.000 | 3 hari |
| Skripsi & Thesis | Rp 150.000 | 5 hari |
| Data Entry | Rp 40.000 | 1 hari |
| Presentasi | Rp 60.000 | 2 hari |

## Safety Mechanisms

| Mekanisme | Deskripsi |
|-----------|-----------|
| **Concurrent Limit** | Max 3 tugas paralel |
| **Category Filter** | Hanya bid tugas sesuai spesialisasi |
| **Budget Cap** | Harga selalu ≤ budget client |
| **Deadline Check** | Skip jika deadline terlalu dekat |
| **Admin Review** | Hasil kerja wajib di-approve admin |
| **Token Tracking** | Log penggunaan token LLM |
| **Cost Monitoring** | Track biaya LLM per aksi |
| **Duplicate Prevention** | Tidak bid ulang di tugas yang sama |

## Environment Variables Baru

```env
# OpenAI API Key (Required for AI Agent)
OPENAI_API_KEY=sk-...

# Optional: Secret for external cron trigger
AGENT_CRON_SECRET=your-secret-key
```

## Admin Dashboard

Tersedia di sidebar admin: **AI Agent** → `/dashboard/admin-keren/agent`

Menampilkan:
- **Stats**: Total actions, success rate, tokens used, LLM cost
- **Config**: Model, spesialisasi, pricing, autonomy settings
- **Pending Drafts**: Draft bid/hasil yang perlu di-review dengan tombol Approve/Reject
- **Activity Logs**: 30 log terbaru dengan detail aksi, status, tokens, dan cost
- **Run Agent**: Tombol manual untuk trigger agent cycle
