(function() {
    // ===== TOAST =====
    function showToast(message, type, duration) {
        type = type || 'warning';
        duration = duration || 10000;
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = 'toast ' + type;
        let icon = 'bi-exclamation-triangle-fill';
        let title = 'Peringatan';
        if (type === 'error') { icon = 'bi-x-circle-fill';
            title = 'Error'; }
        if (type === 'success') { icon = 'bi-check-circle-fill';
            title = 'Sukses'; }
        if (type === 'warning') { icon = 'bi-exclamation-triangle-fill';
            title = 'Peringatan'; }
        toast.innerHTML = `
                    <span class="toast-icon"><i class="bi ${icon}"></i></span>
                    <div class="toast-content">
                        <div class="toast-title">${title}</div>
                        <div>${message}</div>
                    </div>
                    <button class="toast-close"><i class="bi bi-x-lg"></i></button>
                    <div class="toast-timer ${type}"></div>
                `;
        container.appendChild(toast);
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', function() { closeToast(toast); });
        const timer = setTimeout(function() { closeToast(toast); }, duration);
        toast.dataset.timer = timer;
        return toast;
    }

    function closeToast(toast) {
        if (toast.classList.contains('hiding')) return;
        toast.classList.add('hiding');
        clearTimeout(toast.dataset.timer);
        setTimeout(function() {
            if (toast.parentNode) { toast.parentNode.removeChild(toast); }
        }, 300);
    }

    // ===== POPUP =====
    function showPopup() {
        document.getElementById('popupOverlay').classList.add('show');
    }

    function hidePopup() {
        document.getElementById('popupOverlay').classList.remove('show');
        resetAll();
    }

    document.getElementById('popupCloseBtn').addEventListener('click', hidePopup);
    document.getElementById('popupOverlay').addEventListener('click', function(e) {
        if (e.target === this) hidePopup();
    });

    // ===== CONFIRM DIALOG =====
    let confirmResolve = null;
    let hasConfirmedExtra = false;

    function showConfirm(qty, extra, biayaTambahan, total) {
        return new Promise((resolve) => {
            document.getElementById('confirmQty').textContent = qty;
            document.getElementById('confirmExtra').textContent = extra;
            document.getElementById('confirmBiaya').textContent = formatRp(biayaTambahan);
            document.getElementById('confirmTotal').textContent = formatRp(total);
            document.getElementById('confirmOverlay').classList.add('show');
            confirmResolve = resolve;
        });
    }

    function hideConfirm() {
        document.getElementById('confirmOverlay').classList.remove('show');
        if (confirmResolve) {
            confirmResolve(false);
            confirmResolve = null;
        }
    }

    document.getElementById('confirmYes').addEventListener('click', function() {
        document.getElementById('confirmOverlay').classList.remove('show');
        hasConfirmedExtra = true;
        if (confirmResolve) {
            confirmResolve(true);
            confirmResolve = null;
        }
    });

    document.getElementById('confirmNo').addEventListener('click', function() {
        document.getElementById('confirmOverlay').classList.remove('show');
        if (confirmResolve) {
            confirmResolve(false);
            confirmResolve = null;
        }
    });

    // ===== GENERATE 8 CHARACTER RANDOM CODE =====
    function generateTicketCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // ===== RESET ALL =====
    function resetAll() {
        document.getElementById('nama').value = '';
        document.getElementById('waPIC').value = '';
        document.getElementById('tanggal').value = new Date().toISOString().split('T')[0];
        document.getElementById('jam').value = '08:00';
        document.getElementById('tujuan').value = '';
        document.getElementById('tujuanVisit').value = '';
        document.getElementById('tipeUnit').value = '';
        document.getElementById('tipeLainnyaInput').value = '';
        document.getElementById('tipeLainnyaForm').classList.remove('show');
        document.getElementById('zonaSelect').value = '';
        document.getElementById('qty').value = 1;
        document.getElementById('qtyBadge').textContent = 1;
        document.getElementById('lokasiTujuan').textContent = 'Pilih zona di bawah';
        document.getElementById('tujuanBadge').textContent = 'Pilih';
        document.getElementById('tipeBadge').textContent = 'Pilih';
        document.getElementById('zonaBadge').textContent = 'Zona';
        document.getElementById('zonaBadge').className = 'badge-zona';

        document.getElementById('priceDisplay').textContent = 'Rp -';
        document.getElementById('priceDetail').textContent = 'Pilih zona untuk melihat harga';
        document.getElementById('breakdownZona').textContent = 'Zona: -';
        document.getElementById('breakdownQty').textContent = 'Unit: 1';
        document.getElementById('breakdownTotal').textContent = 'Total: -';

        document.getElementById('strukContainer').className = '';
        document.getElementById('paymentSection').className = 'payment-section';
        document.getElementById('paymentSection').classList.remove('hide');
        document.getElementById('paymentConfirm').className = 'payment-confirm';
        document.getElementById('payDetail').innerHTML = '';
        document.querySelectorAll('.pay-btn').forEach(b => b.classList.remove('active'));

        const sendBtn = document.getElementById('btnSendWA');
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<i class="bi bi-whatsapp"></i> Kirim ke Admin';
        sendBtn.className = 'btn btn-send-wa';

        document.getElementById('tokenSection').className = 'token-section';
        document.getElementById('tokenSection').classList.remove('hide');
        document.getElementById('tokenInput').value = '';
        document.getElementById('tokenInput').disabled = true;
        document.getElementById('btnVerify').disabled = true;
        document.getElementById('tokenStatus').className = 'token-status';
        document.getElementById('tokenStatus').innerHTML = '';
        document.getElementById('tokenInfo').className = 'token-status info show';
        document.getElementById('tokenInfo').innerHTML =
            '<i class="bi bi-info-circle"></i> Kirim informasi ke Admin untuk mendapatkan token.';
        document.getElementById('btnDownload').disabled = true;
        document.getElementById('downloadGroup').style.display = 'none';
        document.getElementById('timerDisplay').style.display = 'flex';
        document.getElementById('timerCount').textContent = '300';
        document.getElementById('timerDisplay').className = 'timer-display';

        currentZona = null;
        currentHarga = 0;
        selectedPayment = null;
        tokenValid = false;
        isDownloaded = false;
        isTicketCreated = false;
        hasConfirmedExtra = false;

        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }

        ticketNumber.textContent = generateTicketCode();

        document.getElementById('sNama').textContent = '-';
        document.getElementById('sWAPIC').textContent = '-';
        document.getElementById('sTanggalJam').textContent = '-';
        document.getElementById('sTujuanVisit').textContent = '-';
        document.getElementById('sTipeUnit').textContent = '-';
        document.getElementById('sTujuan').textContent = '-';
        document.getElementById('sZona').textContent = '-';
        document.getElementById('sQty').textContent = '-';
        document.getElementById('sTotal').textContent = '-';

        showToast('Form telah direset', 'success', 3000);
    }

    // ===== DOM REFS =====
    const nama = document.getElementById('nama');
    const waPIC = document.getElementById('waPIC');
    const tanggal = document.getElementById('tanggal');
    const jam = document.getElementById('jam');
    const tujuan = document.getElementById('tujuan');
    const tujuanVisit = document.getElementById('tujuanVisit');
    const tipeUnit = document.getElementById('tipeUnit');
    const tipeLainnyaForm = document.getElementById('tipeLainnyaForm');
    const tipeLainnyaInput = document.getElementById('tipeLainnyaInput');
    const zonaSelect = document.getElementById('zonaSelect');
    const zonaBadge = document.getElementById('zonaBadge');
    const qtyInput = document.getElementById('qty');
    const qtyBadge = document.getElementById('qtyBadge');
    const qtyMinus = document.getElementById('qtyMinus');
    const qtyPlus = document.getElementById('qtyPlus');
    const lokasiTujuan = document.getElementById('lokasiTujuan');

    const sNama = document.getElementById('sNama');
    const sWAPIC = document.getElementById('sWAPIC');
    const sTanggalJam = document.getElementById('sTanggalJam');
    const sTujuanVisit = document.getElementById('sTujuanVisit');
    const sTipeUnit = document.getElementById('sTipeUnit');
    const sTujuan = document.getElementById('sTujuan');
    const sZona = document.getElementById('sZona');
    const sQty = document.getElementById('sQty');
    const sDari = document.getElementById('sDari');
    const sTotal = document.getElementById('sTotal');
    const sWaktu = document.getElementById('sWaktu');
    const ticketNumber = document.getElementById('ticketNumber');

    const strukContainer = document.getElementById('strukContainer');
    const priceDisplay = document.getElementById('priceDisplay');
    const priceDetail = document.getElementById('priceDetail');
    const breakdownZona = document.getElementById('breakdownZona');
    const breakdownQty = document.getElementById('breakdownQty');
    const breakdownTotal = document.getElementById('breakdownTotal');

    const btnHitung = document.getElementById('btnHitung');
    const btnSendWA = document.getElementById('btnSendWA');
    const btnDownload = document.getElementById('btnDownload');
    const downloadLoading = document.getElementById('downloadLoading');
    const downloadGroup = document.getElementById('downloadGroup');

    const tokenSection = document.getElementById('tokenSection');
    const tokenInput = document.getElementById('tokenInput');
    const btnVerify = document.getElementById('btnVerify');
    const tokenStatus = document.getElementById('tokenStatus');
    const tokenInfo = document.getElementById('tokenInfo');
    const timerDisplay = document.getElementById('timerDisplay');
    const timerCount = document.getElementById('timerCount');

    const paymentSection = document.getElementById('paymentSection');
    const paymentConfirm = document.getElementById('paymentConfirm');
    const payMethodText = document.getElementById('payMethodText');
    const payDetail = document.getElementById('payDetail');
    const payBtns = document.querySelectorAll('.pay-btn');

    // ===== KONSTANTA =====
    const ZONA = {
        zona1: { nama: 'Zona 1 - Jakarta Pusat & Sekitar', harga: 250000, wilayah: 'Jakarta Pusat & Sekitar' },
        zona2: { nama: 'Zona 2 - Jakarta Selatan, Timur, Barat', harga: 350000, wilayah: 'Jakarta Selatan, Timur, Barat' },
        zona3: { nama: 'Zona 3 - Tangerang, Bekasi, Depok', harga: 500000, wilayah: 'Tangerang, Bekasi, Depok' },
        zona4: { nama: 'Zona 4 - Bogor, Cibubur, Cileungsi', harga: 650000, wilayah: 'Bogor, Cibubur, Cileungsi' },
        zona5: { nama: 'Zona 5 - Luar Jabodetabek', harga: 1000000, wilayah: 'Luar Jabodetabek' }
    };

    const TUJUAN_VISIT = {
        pengecekan: 'Pengecekan Unit (Rusak / Mati)',
        survei: 'Survei Lokasi Pemasangan',
        instalasi: 'Instalasi / Pemasangan Baru',
        maintenance: 'Maintenance / Perawatan',
        konsultasi: 'Konsultasi Teknis'
    };

    const TIPE_UNIT = {
        cctv: 'CCTV',
        ac: 'AC / HVAC',
        listrik: 'Kelistrikan & Panel',
        server: 'Server & Jaringan',
        telepon: 'Telepon & PABX',
        akses: 'Access Control',
        fire: 'Fire Alarm',
        sound: 'Sound System',
        lift: 'Lift / Elevator',
        genset: 'Genset / Generator',
        pompa: 'Pompa & Plumbing',
        struktur: 'Struktur & Bangunan',
        lainnya: 'Lainnya'
    };

    const TAMBAHAN_PER_UNIT = 30000;
    const BATAS_QTY_DASAR = 5;
    const TOKEN_EXPIRY = 300;

    const PAYMENT_DATA = {
        gopay: {
            nama: 'Wisnu Sugianto Rahakbauw',
            nomor: '0812 8291 9693',
            label: 'GoPay'
        },
        dana: {
            nama: 'Wisnu Sugianto Rahakbauw',
            nomor: '0812 8291 9693',
            label: 'DANA'
        },
        transfer: {
            nama: 'Wisnu Sugianto Rahakbauw',
            bank: 'BCA',
            rekening: '4010406523',
            label: 'Transfer Bank'
        }
    };

    const WA_NUMBER = '6281282919693';

    let currentZona = null;
    let currentHarga = 0;
    let selectedPayment = null;
    let currentToken = '';
    let tokenValid = false;
    let timerInterval = null;
    let timerSeconds = TOKEN_EXPIRY;
    let isDownloaded = false;
    let isTicketCreated = false;

    // ===== SET DEFAULT =====
    const today = new Date();
    tanggal.value = today.toISOString().split('T')[0];
    jam.value = today.toTimeString().slice(0, 5);
    sWaktu.textContent = today.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    sDari.textContent = 'Jl. Batu Ceper VII RT 08 RW 01 No 18, Sawah Besar, Jakarta Pusat';
    ticketNumber.textContent = generateTicketCode();

    // ===== FORMAT RUPIAH =====
    function formatRp(angka) {
        return 'Rp ' + angka.toLocaleString('id-ID');
    }

    // ===== HITUNG HARGA =====
    function hitungHarga(zonaKey, qty) {
        const zona = ZONA[zonaKey];
        if (!zona) {
            return { total: 0, hargaDasar: 0, perUnit: 0, tambahan: 0, qtyTambahan: 0, valid: false };
        }
        const qtyValid = Math.max(1, qty || 1);
        const hargaDasar = zona.harga;
        let qtyTambahan = 0;
        let tambahan = 0;
        if (qtyValid > BATAS_QTY_DASAR) {
            qtyTambahan = qtyValid - BATAS_QTY_DASAR;
            tambahan = qtyTambahan * TAMBAHAN_PER_UNIT;
        }
        const total = hargaDasar + tambahan;
        const perUnit = Math.round(total / qtyValid);
        return {
            total: total,
            hargaDasar: hargaDasar,
            perUnit: perUnit,
            tambahan: tambahan,
            qtyTambahan: qtyTambahan,
            valid: true,
            zona: zona
        };
    }

    // ===== UPDATE HARGA PREVIEW =====
    function updatePricePreview(zonaKey, qty) {
        const qtyVal = parseInt(qty) || 1;
        if (!zonaKey || !ZONA[zonaKey]) {
            priceDisplay.textContent = 'Rp -';
            priceDetail.textContent = 'Pilih zona untuk melihat harga';
            breakdownZona.textContent = 'Zona: -';
            breakdownQty.textContent = 'Unit: ' + qtyVal;
            breakdownTotal.textContent = 'Total: -';
            currentHarga = 0;
            currentZona = null;
            zonaBadge.textContent = 'Zona';
            zonaBadge.className = 'badge-zona';
            return;
        }
        const result = hitungHarga(zonaKey, qtyVal);
        const zona = ZONA[zonaKey];
        if (result.valid) {
            priceDisplay.textContent = formatRp(result.total);
            let detailText = 'Harga dasar: ' + formatRp(zona.harga);
            if (result.qtyTambahan > 0) {
                detailText += ' + ' + result.qtyTambahan + ' unit × ' + formatRp(TAMBAHAN_PER_UNIT);
            }
            priceDetail.textContent = detailText;
            breakdownZona.textContent = 'Zona: ' + zona.wilayah;
            breakdownQty.textContent = 'Unit: ' + qtyVal;
            breakdownTotal.textContent = 'Total: ' + formatRp(result.total);
            currentHarga = result.total;
            currentZona = zonaKey;
            zonaBadge.textContent = zona.wilayah;
            const zonaClass = zonaKey.replace('zona', 'z');
            zonaBadge.className = 'badge-zona zona-badge ' + zonaClass;
            lokasiTujuan.textContent = zona.wilayah;
        }
    }

    // ===== EVENT LISTENERS =====
    zonaSelect.addEventListener('change', function() {
        const qtyVal = parseInt(qtyInput.value) || 1;
        updatePricePreview(this.value, qtyVal);
    });

    tujuanVisit.addEventListener('change', function() {
        const val = this.value;
        const badge = document.getElementById('tujuanBadge');
        if (val && TUJUAN_VISIT[val]) {
            badge.textContent = TUJUAN_VISIT[val];
        } else {
            badge.textContent = 'Pilih';
        }
    });

    tipeUnit.addEventListener('change', function() {
        const val = this.value;
        const badge = document.getElementById('tipeBadge');
        if (val === 'lainnya') {
            tipeLainnyaForm.classList.add('show');
            tipeLainnyaInput.focus();
            badge.textContent = 'Lainnya ✏️';
        } else {
            tipeLainnyaForm.classList.remove('show');
            if (val && TIPE_UNIT[val]) {
                badge.textContent = TIPE_UNIT[val];
            } else {
                badge.textContent = 'Pilih';
            }
        }
    });

    // ===== QTY =====
    function updateQty(val) {
        let qty = parseInt(val) || 1;
        if (qty < 1) qty = 1;
        if (qty > 999) qty = 999;
        qtyInput.value = qty;
        qtyBadge.textContent = qty;
        const zonaKey = zonaSelect.value;
        if (zonaKey && ZONA[zonaKey]) {
            updatePricePreview(zonaKey, qty);
        }
    }

    qtyInput.addEventListener('change', function() { updateQty(this.value); });
    qtyInput.addEventListener('input', function() {
        const val = parseInt(this.value) || 1;
        qtyBadge.textContent = Math.max(1, val);
    });

    // ===== QTY PLUS - CEK FLAG =====
    qtyPlus.addEventListener('click', function() {
        const current = parseInt(qtyInput.value) || 1;
        const newQty = current + 1;

        if (hasConfirmedExtra) {
            updateQty(newQty);
            return;
        }

        if (newQty > BATAS_QTY_DASAR) {
            const zonaKey = zonaSelect.value;
            if (!zonaKey || !ZONA[zonaKey]) {
                showToast('Pilih zona terlebih dahulu!', 'warning', 10000);
                return;
            }

            const result = hitungHarga(zonaKey, newQty);
            const extra = newQty - BATAS_QTY_DASAR;
            const tambahan = extra * TAMBAHAN_PER_UNIT;

            showConfirm(newQty, extra, tambahan, result.total).then(confirmed => {
                if (confirmed) {
                    updateQty(newQty);
                    showToast('Biaya tambahan disetujui!', 'success', 3000);
                } else {
                    showToast('Penambahan unit dibatalkan', 'warning', 3000);
                }
            });
        } else {
            updateQty(newQty);
        }
    });

    // ===== QTY MINUS =====
    qtyMinus.addEventListener('click', function() {
        const current = parseInt(qtyInput.value) || 1;
        if (current > 1) {
            updateQty(current - 1);
        }
    });

    // ===== TIMER =====
    function startTimer() {
        timerSeconds = TOKEN_EXPIRY;
        timerCount.textContent = timerSeconds;
        timerDisplay.className = 'timer-display';

        if (timerInterval) clearInterval(timerInterval);

        timerInterval = setInterval(function() {
            timerSeconds--;
            timerCount.textContent = timerSeconds;

            if (timerSeconds <= 10) {
                timerDisplay.className = 'timer-display danger';
            } else if (timerSeconds <= 30) {
                timerDisplay.className = 'timer-display warning';
            }

            if (timerSeconds <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                tokenValid = false;
                tokenStatus.className = 'token-status show expired';
                tokenStatus.innerHTML = '<i class="bi bi-clock-history"></i> Token telah expired! Silakan buat tiket baru.';
                btnDownload.disabled = true;
                tokenInput.disabled = true;
                btnVerify.disabled = true;
                timerDisplay.className = 'timer-display danger';
                timerCount.textContent = '0';

                showToast('Token expired! Silakan buat tiket baru.', 'warning', 10000);
            }
        }, 1000);
    }

    // ===== STOP TIMER =====
    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        timerDisplay.style.display = 'none';
    }

    // ===== GENERATE TIKET =====
    async function generateTicket() {
        const namaVal = nama.value.trim() || '(tidak diisi)';
        const waPICVal = waPIC.value.trim() || '(tidak diisi)';
        const tanggalVal = tanggal.value || 'tidak diisi';
        const jamVal = jam.value || '00:00';
        const tanggalJamVal = tanggalVal + ' ' + jamVal;
        const tujuanVisitVal = tujuanVisit.value ? TUJUAN_VISIT[tujuanVisit.value] : '(tidak dipilih)';
        let tipeUnitVal = '';
        if (tipeUnit.value === 'lainnya') {
            const manual = tipeLainnyaInput.value.trim();
            tipeUnitVal = manual ? manual : 'Lainnya (tidak diisi)';
        } else if (tipeUnit.value && TIPE_UNIT[tipeUnit.value]) {
            tipeUnitVal = TIPE_UNIT[tipeUnit.value];
        } else {
            tipeUnitVal = '(tidak dipilih)';
        }
        const tujuanVal = tujuan.value.trim() || '(tidak diisi)';
        const zonaKey = zonaSelect.value;
        const qtyVal = parseInt(qtyInput.value) || 1;

        if (!zonaKey || !ZONA[zonaKey]) {
            showToast('Mohon pilih zona tujuan terlebih dahulu!', 'warning', 10000);
            return false;
        }

        if (qtyVal > BATAS_QTY_DASAR && !hasConfirmedExtra) {
            const result = hitungHarga(zonaKey, qtyVal);
            const extra = qtyVal - BATAS_QTY_DASAR;
            const tambahan = extra * TAMBAHAN_PER_UNIT;

            const confirmed = await showConfirm(qtyVal, extra, tambahan, result.total);

            if (!confirmed) {
                showToast('Pembuatan tiket dibatalkan', 'warning', 10000);
                return false;
            }
        }

        const result = hitungHarga(zonaKey, qtyVal);
        const zona = ZONA[zonaKey];

        const newCode = generateTicketCode();
        ticketNumber.textContent = newCode;
        currentToken = 'VST-' + newCode;

        sNama.textContent = namaVal;
        sWAPIC.textContent = waPICVal;
        sTanggalJam.textContent = tanggalJamVal;
        sTujuanVisit.textContent = tujuanVisitVal;
        sTipeUnit.textContent = tipeUnitVal;
        sTujuan.textContent = tujuanVal;
        sZona.textContent = zona.nama;
        sQty.textContent = qtyVal + ' unit';
        sTotal.textContent = formatRp(result.total);

        const now2 = new Date();
        sWaktu.textContent = now2.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

        strukContainer.className = 'show';
        isTicketCreated = true;

        paymentSection.classList.add('show');
        paymentSection.classList.remove('hide');
        paymentConfirm.classList.remove('show');
        payDetail.innerHTML = '';
        selectedPayment = null;
        payBtns.forEach(b => b.classList.remove('active'));

        btnSendWA.disabled = false;
        btnSendWA.innerHTML = '<i class="bi bi-whatsapp"></i> Kirim ke Admin';
        btnSendWA.className = 'btn btn-send-wa';

        tokenValid = false;
        tokenInput.value = '';
        tokenInput.disabled = true;
        btnVerify.disabled = true;
        tokenStatus.className = 'token-status';
        tokenStatus.innerHTML = '';
        tokenInfo.className = 'token-status info show';
        tokenInfo.innerHTML = '<i class="bi bi-info-circle"></i> Kirim informasi ke Admin untuk mendapatkan token.';
        btnDownload.disabled = true;
        downloadGroup.style.display = 'none';
        tokenSection.classList.remove('show');
        tokenSection.classList.remove('hide');
        timerDisplay.style.display = 'flex';
        isDownloaded = false;

        showToast('Tiket berhasil dibuat! Pilih metode pembayaran dan kirim ke Admin.', 'success', 10000);
        return true;
    }

    // ===== SEND WA =====
    btnSendWA.addEventListener('click', function() {
        if (!isTicketCreated) {
            showToast('Buat tiket terlebih dahulu!', 'warning', 10000);
            return;
        }

        if (!selectedPayment) {
            showToast('Pilih metode pembayaran terlebih dahulu!', 'warning', 10000);
            return;
        }

        const data = PAYMENT_DATA[selectedPayment];
        const qtyVal = parseInt(qtyInput.value) || 1;
        const extra = qtyVal > BATAS_QTY_DASAR ? qtyVal - BATAS_QTY_DASAR : 0;

        let biayaTambahanText = '';
        if (extra > 0) {
            biayaTambahanText =
                `\n\n*Catatan Biaya Tambahan:*\nUnit yang dicek sebanyak ${qtyVal} unit (melebihi batas 5 unit).\nTerdapat biaya tambahan sebesar ${extra} unit × Rp ${TAMBAHAN_PER_UNIT.toLocaleString('id-ID')} = ${formatRp(extra * TAMBAHAN_PER_UNIT)}\nBiaya ini merupakan biaya tambahan yang disepakati dan menjadi bukti sah atas penambahan unit yang dikerjakan.`;
        }

        const message =
            'TIKET KUNJUNGAN\n' +
            '============================\n\n' +
            'Nomor Tiket    : ' + currentToken + '\n' +
            'PIC            : ' + sNama.textContent + '\n' +
            'WA PIC         : ' + sWAPIC.textContent + '\n' +
            'Tanggal & Jam  : ' + sTanggalJam.textContent + '\n' +
            'Tujuan Visit   : ' + sTujuanVisit.textContent + '\n' +
            'Tipe Unit      : ' + sTipeUnit.textContent + '\n' +
            'Alamat         : ' + sTujuan.textContent + '\n' +
            'Zona           : ' + sZona.textContent + '\n' +
            'Jumlah Unit    : ' + sQty.textContent + '\n' +
            'Total Biaya    : ' + sTotal.textContent + '\n' +
            '\n' +
            'Metode Pembayaran : ' + data.label + '\n' +
            (biayaTambahanText ? biayaTambahanText : '') +
            '\n' +
            '============================\n' +
            'Instruksi:\n' +
            '1. Lakukan pembayaran ke rekening di atas\n' +
            '2. Kirim bukti pembayaran ke Admin\n' +
            '3. Tunggu token verifikasi dari Admin\n' +
            '4. Masukkan token untuk download tiket\n' +
            '\n' +
            '---\n' +
            'Terima kasih telah menggunakan layanan kami.';

        const encodedMessage = encodeURIComponent(message);
        const waUrl = 'https://wa.me/' + WA_NUMBER + '?text=' + encodedMessage;

        window.open(waUrl, '_blank');

        btnSendWA.disabled = true;
        btnSendWA.innerHTML = '<i class="bi bi-check-circle"></i> Terkirim';
        btnSendWA.className = 'btn btn-send-wa sent';

        tokenSection.classList.add('show');
        tokenSection.classList.remove('hide');
        tokenInput.disabled = false;
        btnVerify.disabled = false;
        tokenInfo.className = 'token-status info show';
        tokenInfo.innerHTML = '<i class="bi bi-info-circle"></i> Masukkan token yang diberikan Admin melalui WhatsApp.';
        tokenInput.placeholder = '';

        startTimer();

        showToast('Informasi berhasil dikirim ke Admin! Tunggu token.', 'success', 10000);
    });

    // ===== VERIFY TOKEN =====
    function verifyToken() {
        const inputToken = tokenInput.value.trim().toUpperCase();

        if (!inputToken) {
            tokenStatus.className = 'token-status show error';
            tokenStatus.innerHTML = '<i class="bi bi-exclamation-circle"></i> Masukkan token terlebih dahulu!';
            return;
        }

        if (inputToken === currentToken) {
            tokenValid = true;
            tokenStatus.className = 'token-status show success';
            tokenStatus.innerHTML = '<i class="bi bi-check-circle-fill"></i> Token valid! Silakan download tiket.';
            btnDownload.disabled = false;
            downloadGroup.style.display = 'flex';
            tokenInput.disabled = true;
            btnVerify.disabled = true;

            paymentSection.classList.add('hide');
            tokenSection.classList.add('hide');

            stopTimer();
            showToast('Token berhasil diverifikasi!', 'success', 10000);
        } else {
            tokenStatus.className = 'token-status show error';
            tokenStatus.innerHTML = '<i class="bi bi-x-circle-fill"></i> Token salah! Coba lagi.';
            showToast('Token salah! Silakan coba lagi.', 'error', 10000);
        }
    }

    // ===== DOWNLOAD TIKET =====
    function downloadGambar() {
        if (!strukContainer.classList.contains('show')) {
            showToast('Buat tiket terlebih dahulu!', 'warning', 10000);
            return;
        }

        if (!tokenValid) {
            showToast('Verifikasi token terlebih dahulu!', 'warning', 10000);
            return;
        }

        if (isDownloaded) {
            showToast('Tiket sudah di download!', 'warning', 10000);
            return;
        }

        const btn = btnDownload;
        const loading = downloadLoading;

        btn.style.display = 'none';
        loading.classList.add('show');

        const originalStruk = document.getElementById('strukContainer');
        const cloneStruk = originalStruk.cloneNode(true);

        const details = cloneStruk.querySelectorAll('.struk-item.detail');
        details.forEach(el => {
            if (!el.textContent.includes('Dari')) {
                el.style.display = 'none';
            }
        });

        const totalItems = cloneStruk.querySelectorAll('.struk-item.total');
        totalItems.forEach(el => el.style.display = 'none');

        const footer = cloneStruk.querySelector('.struk-footer');
        if (footer) footer.style.display = 'none';

        cloneStruk.style.position = 'fixed';
        cloneStruk.style.left = '-9999px';
        cloneStruk.style.top = '0';
        cloneStruk.style.width = '400px';
        cloneStruk.style.background = 'white';
        cloneStruk.style.border = '2px solid #e8a530';
        cloneStruk.style.borderRadius = '20px';
        cloneStruk.style.overflow = 'hidden';
        cloneStruk.style.display = 'block';
        cloneStruk.style.zIndex = '9999';
        document.body.appendChild(cloneStruk);

        setTimeout(function() {
            html2canvas(cloneStruk, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
                allowTaint: true,
                width: 400,
                height: cloneStruk.scrollHeight
            }).then(function(canvas) {
                document.body.removeChild(cloneStruk);
                const link = document.createElement('a');
                link.download = 'Tiket_Kunjungan_VST-' + ticketNumber.textContent + '.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
                btn.style.display = 'flex';
                loading.classList.remove('show');

                isDownloaded = true;
                btnDownload.disabled = true;
                showPopup();

                showToast('Tiket berhasil di download!', 'success', 10000);
            }).catch(function(err) {
                console.error('Error download:', err);
                document.body.removeChild(cloneStruk);
                btn.style.display = 'flex';
                loading.classList.remove('show');
                showToast('Gagal download gambar. Silakan coba lagi.', 'error', 10000);
            });
        }, 300);
    }

    // ===== PEMBAYARAN =====
    payBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const method = this.dataset.method;
            const data = PAYMENT_DATA[method];

            payBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            selectedPayment = method;
            payMethodText.textContent = data.label;

            let detailHTML = '';
            if (method === 'gopay' || method === 'dana') {
                detailHTML = `
                            <div class="pay-row">
                                <span class="pay-label">Nama</span>
                                <span class="pay-value">${data.nama}</span>
                            </div>
                            <div class="pay-row">
                                <span class="pay-label">Nomor</span>
                                <span class="pay-value">${data.nomor}</span>
                            </div>
                        `;
            } else if (method === 'transfer') {
                detailHTML = `
                            <div class="pay-row">
                                <span class="pay-label">Nama</span>
                                <span class="pay-value">${data.nama}</span>
                            </div>
                            <div class="pay-row">
                                <span class="pay-label">Bank</span>
                                <span class="pay-value">${data.bank}</span>
                            </div>
                            <div class="pay-row">
                                <span class="pay-label">Nomor Rekening</span>
                                <span class="pay-value">${data.rekening}</span>
                            </div>
                        `;
            }

            payDetail.innerHTML = detailHTML;
            paymentConfirm.classList.add('show');

            if (isTicketCreated) {
                btnSendWA.disabled = false;
            }

            showToast('Pembayaran via ' + data.label + ' berhasil dipilih!', 'success', 10000);
        });
    });

    // ===== TOMBOL =====
    btnHitung.addEventListener('click', async function(e) {
        e.preventDefault();
        await generateTicket();
    });

    btnVerify.addEventListener('click', function(e) {
        e.preventDefault();
        verifyToken();
    });

    tokenInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            verifyToken();
        }
    });

    btnDownload.addEventListener('click', function(e) {
        e.preventDefault();
        downloadGambar();
    });

})();