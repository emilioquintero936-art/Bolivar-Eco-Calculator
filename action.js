/**
 * BOLÍVAR ECO-CALCULATOR - DECOUPLED ES6+ LOGIC CONTROLLER (action.js)
 * Modular state management, pure emission calculations, i18n & DOM event listeners
 */
document.addEventListener('DOMContentLoaded', () => {

    // 1. CONSTANTS & EMISSION FACTORS (kg CO2e)
    const EMISSION_FACTORS = {
        transport: {
            walk: 0.000,
            bus: 0.089,
            carpool: 0.096,
            car: 0.192
        },
        paper: {
            virgin: 0.005,
            recycled: 0.002
        },
        recyclingOffsetPerCategory: 0.50 // kg CO2e reduction per active waste type
    };

    // 2. REVENUE / USER STATE OBJECT
    const state = {
        lang: 'es',
        role: 'student',
        transportMode: 'car',
        distance: 45,
        paperSheets: 30,
        paperType: 'virgin',
        recycling: {
            plastic: true,
            paper: true,
            organic: false,
            ewaste: false
        },
        habits: {
            bottle: true,
            offDevices: false
        }
    };

    // 3. BILINGUAL DICTIONARY (i18n)
    const i18n = {
        es: {
            heroTitle: "Mide tu Huella de Carbono Semanal y Gana Eco-Points",
            heroSubtitle: "Calcula el impacto ambiental de tus desplazamientos al colegio, consumo de papel y hábitos de reciclaje. ¡Consigue insignias y lidera la transformación sostenible!",
            presetsLabel: "Cargar Ejemplo:",
            calculatorTag: "Paso a Paso",
            calculatorHeader: "Calculadora Semanal",
            stepCounterText: "100% Interactivo",
            transTitle: "1. Transporte Principal al Colegio",
            modeWalkText: "Caminata / Bici",
            modeBusText: "Bus Escolar / Bus",
            modeCarpoolText: "Auto Compartido",
            modeCarText: "Auto Particular",
            distanceLabel: "Kilometraje semanal estimado (ida y vuelta):",
            paperTitle: "2. Consumo Semanal de Papel",
            paperLabel: "Hojas / páginas de libreta usadas:",
            paperUnitText: "hojas",
            paperTypeLabel: "Tipo de papel:",
            optVirgin: "Papel Estándar (Virgen)",
            optRecycled: "100% Reciclado (-60% impacto)",
            recycleTitle: "3. Separación de Residuos en el Colegio / Casa",
            bonusTag: "+15 pts c/u",
            recycleSubtitle: "Marca los materiales que separas activamente esta semana:",
            recPlastic: "Plásticos / Botellas",
            recPaper: "Papel y Cartón",
            recOrganic: "Residuos Orgánicos",
            recEwaste: "Electrónicos / Pilas",
            habitsTitle: "4. Compromisos Adicionales (+10 pts)",
            habitBottle: "Uso termo/botella reutilizable a diario",
            habitOff: "Apago luces y equipos al salir del aula",
            btnCalcularText: "Calcular Impacto Semanal",
            resetBtnText: "Restablecer Formulario",
            cardCo2Title: "Huella CO₂",
            cardPointsTitle: "Eco-Points",
            cardAnnualTitle: "Proyección Anual",
            annualUnitText: "Tons CO₂e/año",
            annualCalcSub: "Año escolar (52 sem)",
            cardTreesTitle: "Compensación",
            treesUnitText: "árboles/año",
            treesSubText: "1 árbol ≈ 21.7kg CO₂",
            badgeCategoryTag: "Nivel Alcanzado:",
            chartBreakdownHeading: "Desglose de Emisiones",
            chartBenchmarkHeading: "Comparativa Colegio",
            chart1Footer: "El transporte suele ser la principal fuente de emisiones.",
            chart2Footer: "Meta institucional: Mantenerse por debajo de 4.0 kg CO₂e/semana.",
            tipsHeader: "Recomendaciones Personalizadas para Ti",
            tipsCountTag: "Acciones Clave",
            btnExportText: "Exportar / Imprimir Certificado PDF",
            footerSub: "Diseñado para la comunidad académica. Cumple con estándares ISO 14064 y WCAG 2.1 AA.",
            roleLabelText: "Rol:",
            certMainTitle: "Certificado de Impacto Ecológico Semanal",
            certSubTitle: "Weekly Eco-Impact Certificate — Bolívar Eco-Calculator",
            certDateLabel: "Fecha de Emisión:",
            certRoleLabel: "Comunidad:",
            certScoreLabel: "Eco-Points Obtenidos",
            certScoreSub: "Desempeño Sostenible",
            certCo2Label: "Huella CO₂ Semanal",
            certTierLabel: "Nivel Ecológico",
            certTableHeading: "1. Resumen de Hábitos y Emisiones Evaluadas",
            certThCat: "Categoría",
            certThHabit: "Hábito Reportado",
            certThFactor: "Factor de Impacto",
            certThCo2: "Emisión kg CO₂e",
            certCommitHeader: "2. Compromiso Ambiental Escolar:",
            certCommitText: '"Me comprometo a mantener y mejorar mis hábitos sostenibles en la comunidad Bolívar, reduciendo mi huella de carbono y promoviendo la conservación de recursos."',
            certSignUser: "Firma del Estudiante / Participante",
            certSignOffice: "Sello / Validación Oficina Ambiental",
            certSchoolStamp: "Colegio Bolívar Campus Verde",
            badges: {
                guardian: {
                    name: "Eco Guardián",
                    desc: "¡Excelente! Tus hábitos son un modelo de sostenibilidad para la comunidad Bolívar."
                },
                ally: {
                    name: "Aliado Verde",
                    desc: "¡Buen trabajo! Estás muy cerca de la máxima eficiencia ecológica."
                },
                apprentice: {
                    name: "Aprendiz Ecológico",
                    desc: "Vas por buen camino, pero hay margen significativo para reducir tu huella."
                },
                alert: {
                    name: "Alerta de Huella",
                    desc: "Tu huella es elevada. Revisa el plan de acción para transformar tus hábitos."
                }
            }
        },
        en: {
            heroTitle: "Measure Your Weekly Carbon Footprint & Earn Eco-Points",
            heroSubtitle: "Calculate the environmental impact of your school commute, paper usage, and recycling habits. Earn badges and lead sustainable change!",
            presetsLabel: "Load Preset:",
            calculatorTag: "Step-by-Step",
            calculatorHeader: "Weekly Calculator",
            stepCounterText: "100% Interactive",
            transTitle: "1. Primary School Commute",
            modeWalkText: "Walk / Bicycle",
            modeBusText: "School / Public Bus",
            modeCarpoolText: "Carpool",
            modeCarText: "Private Car",
            distanceLabel: "Estimated weekly distance (round trip total):",
            paperTitle: "2. Weekly Paper Usage",
            paperLabel: "Sheets / notebook pages used:",
            paperUnitText: "sheets",
            paperTypeLabel: "Paper Type:",
            optVirgin: "Standard Paper (Virgin)",
            optRecycled: "100% Recycled (-60% impact)",
            recycleTitle: "3. Waste Separation at School / Home",
            bonusTag: "+15 pts ea.",
            recycleSubtitle: "Select materials you actively separate this week:",
            recPlastic: "Plastics & PET Bottles",
            recPaper: "Paper & Cardboard",
            recOrganic: "Organic Waste",
            recEwaste: "E-Waste / Batteries",
            habitsTitle: "4. Additional Eco-Commitments (+10 pts)",
            habitBottle: "I use a reusable water bottle daily",
            habitOff: "I turn off lights and devices when leaving",
            btnCalcularText: "Calculate Weekly Impact",
            resetBtnText: "Reset Form",
            cardCo2Title: "CO₂ Footprint",
            cardPointsTitle: "Eco-Points",
            cardAnnualTitle: "Annual Projection",
            annualUnitText: "Tons CO₂e/year",
            annualCalcSub: "School year (52 weeks)",
            cardTreesTitle: "Offset Target",
            treesUnitText: "trees/year",
            treesSubText: "1 tree ≈ 21.7kg CO₂",
            badgeCategoryTag: "Achieved Tier:",
            chartBreakdownHeading: "Emission Breakdown",
            chartBenchmarkHeading: "School Benchmark",
            chart1Footer: "Transportation is typically the main driver of emissions.",
            chart2Footer: "Institutional target: Keep emissions under 4.0 kg CO₂e/week.",
            tipsHeader: "Personalized Recommendations for You",
            tipsCountTag: "Key Actions",
            btnExportText: "Export / Print PDF Certificate",
            footerSub: "Designed for the academic community. Complies with ISO 14064 and WCAG 2.1 AA.",
            roleLabelText: "Role:",
            certMainTitle: "Weekly Ecological Impact Certificate",
            certSubTitle: "Weekly Eco-Impact Certificate — Bolívar Eco-Calculator",
            certDateLabel: "Issue Date:",
            certRoleLabel: "Community:",
            certScoreLabel: "Eco-Points Score",
            certScoreSub: "Sustainable Rating",
            certCo2Label: "Weekly CO₂ Footprint",
            certTierLabel: "Eco Tier Level",
            certTableHeading: "1. Summary of Evaluated Habits and Emissions",
            certThCat: "Category",
            certThHabit: "Reported Habit",
            certThFactor: "Impact Factor",
            certThCo2: "Emission kg CO₂e",
            certCommitHeader: "2. School Environmental Pledge:",
            certCommitText: '"I pledge to maintain and improve my sustainable habits within the Bolívar community, reducing my carbon footprint and promoting resource conservation."',
            certSignUser: "Student / Participant Signature",
            certSignOffice: "Environmental Office Seal / Validation",
            certSchoolStamp: "Colegio Bolívar Green Campus",
            badges: {
                guardian: {
                    name: "Eco Guardian",
                    desc: "Outstanding! Your habits are a benchmark of sustainability for the Bolívar community."
                },
                ally: {
                    name: "Green Ally",
                    desc: "Great job! You are very close to maximum ecological efficiency."
                },
                apprentice: {
                    name: "Eco Apprentice",
                    desc: "You are on the right track, but there is clear room to reduce your impact."
                },
                alert: {
                    name: "High Impact Alert",
                    desc: "Your footprint is elevated. Follow the actionable plan to transform your habits."
                }
            }
        }
    };

    let breakdownChartInstance = null;
    let benchmarkChartInstance = null;

    // 4. CHART INITIALIZATION
    function initCharts() {
        const ctx1 = document.getElementById('breakdownChart').getContext('2d');
        breakdownChartInstance = new Chart(ctx1, {
            type: 'doughnut',
            data: {
                labels: ['Transporte', 'Papel', 'Descuento Reciclaje'],
                datasets: [{
                    data: [5, 1, 1],
                    backgroundColor: ['#059669', '#d97706', '#0d9488'],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10, family: 'Plus Jakarta Sans' } } }
                },
                cutout: '70%'
            }
        });

        const ctx2 = document.getElementById('benchmarkChart').getContext('2d');
        benchmarkChartInstance = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: ['Tu Huella', 'Promedio Colegio', 'Meta Eco'],
                datasets: [{
                    data: [6.5, 12.5, 3.5],
                    backgroundColor: ['#059669', '#94a3b8', '#10b981'],
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { font: { size: 10, family: 'Plus Jakarta Sans' } } },
                    x: { grid: { display: false }, ticks: { font: { size: 10, family: 'Plus Jakarta Sans' } } }
                }
            }
        });
    }

    // 5. CORE CALCULATION ENGINE
    function calculateCo2Penalty(netCo2) {
        if (netCo2 <= 2) return 0;
        if (netCo2 > 15) return (netCo2 - 2) * 3.0;
        if (netCo2 > 8) return (netCo2 - 2) * 2.2;
        return (netCo2 - 2) * 1.5;
    }

    function recalculate() {
        const transFactor = EMISSION_FACTORS.transport[state.transportMode];
        const co2Transport = state.distance * transFactor;

        const paperFactor = EMISSION_FACTORS.paper[state.paperType];
        const co2Paper = state.paperSheets * paperFactor;

        const activeRecycledCount = Object.values(state.recycling).filter(Boolean).length;
        const co2RecyclingOffset = activeRecycledCount * EMISSION_FACTORS.recyclingOffsetPerCategory;

        const grossCo2 = co2Transport + co2Paper;
        const netCo2Weekly = Math.max(0, grossCo2 - co2RecyclingOffset);

        const annualTons = (netCo2Weekly * 52) / 1000;
        const treesNeeded = Math.ceil((netCo2Weekly * 52) / 21.7);

        let points = 70;
        points += (activeRecycledCount * 10);

        if (state.transportMode === 'walk') points += 20;
        else if (state.transportMode === 'bus') points += 10;
        else if (state.transportMode === 'carpool') points += 10;

        if (state.habits.bottle) points += 5;
        if (state.habits.offDevices) points += 5;

        const co2Penalty = calculateCo2Penalty(netCo2Weekly);
        points -= co2Penalty;

        const ecoPointsScore = Math.min(100, Math.max(0, Math.round(points)));

        // DOM Updates
        document.getElementById('valCo2Weekly').textContent = netCo2Weekly.toFixed(1);
        document.getElementById('valEcoPoints').textContent = ecoPointsScore;
        document.getElementById('pointsProgressBar').style.width = `${ecoPointsScore}%`;
        document.getElementById('valCo2Annual').textContent = annualTons.toFixed(2);
        document.getElementById('valTreesNeeded').textContent = treesNeeded;

        const badgeCo2 = document.getElementById('badgeCo2Status');
        if (netCo2Weekly < 4.0) {
            badgeCo2.className = "text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300";
            badgeCo2.textContent = state.lang === 'es' ? 'Bajo Impacto' : 'Low Impact';
        } else if (netCo2Weekly < 12.0) {
            badgeCo2.className = "text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300";
            badgeCo2.textContent = state.lang === 'es' ? 'Moderado' : 'Moderate';
        } else {
            badgeCo2.className = "text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300";
            badgeCo2.textContent = state.lang === 'es' ? 'Alto Impacto' : 'High Impact';
        }

        updateBadgeTier(ecoPointsScore);
        updateChartsData(co2Transport, co2Paper, co2RecyclingOffset, netCo2Weekly);
        renderRecommendations(netCo2Weekly, co2Transport, co2Paper, activeRecycledCount);
        populateCertificateData(netCo2Weekly, ecoPointsScore, co2Transport, co2Paper, co2RecyclingOffset);

        if (ecoPointsScore >= 90 && Math.random() < 0.15) {
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        }
    }

    function updateBadgeTier(score) {
        const bDict = i18n[state.lang].badges;
        let bKey = 'apprentice';
        let iconClass = 'fa-medal';
        let bgClass = 'bg-teal-100 text-teal-700 border-teal-300';

        if (score >= 80) {
            bKey = 'guardian';
            iconClass = 'fa-crown';
            bgClass = 'bg-amber-100 text-amber-600 border-amber-300';
        } else if (score >= 60) {
            bKey = 'ally';
            iconClass = 'fa-seedling';
            bgClass = 'bg-emerald-100 text-emerald-700 border-emerald-300';
        } else if (score >= 35) {
            bKey = 'apprentice';
            iconClass = 'fa-award';
            bgClass = 'bg-teal-100 text-teal-700 border-teal-300';
        } else {
            bKey = 'alert';
            iconClass = 'fa-triangle-exclamation';
            bgClass = 'bg-rose-100 text-rose-700 border-rose-300';
        }

        const info = bDict[bKey];
        document.getElementById('badgeTitleText').textContent = info.name;
        document.getElementById('badgeDescText').textContent = info.desc;
        
        const iconContainer = document.getElementById('badgeIconContainer');
        iconContainer.className = `w-16 h-16 rounded-2xl ${bgClass} flex items-center justify-center text-3xl shrink-0 shadow-inner border`;
        iconContainer.innerHTML = `<i class="fa-solid ${iconClass}"></i>`;
    }

    function updateChartsData(co2Trans, co2Paper, co2Offset, netCo2) {
        if (!breakdownChartInstance || !benchmarkChartInstance) return;

        const isEs = state.lang === 'es';

        breakdownChartInstance.data.labels = isEs 
            ? ['Transporte', 'Consumo Papel', 'Offset Reciclaje']
            : ['Transport', 'Paper Usage', 'Recycling Offset'];
        breakdownChartInstance.data.datasets[0].data = [
            parseFloat(co2Trans.toFixed(2)),
            parseFloat(co2Paper.toFixed(2)),
            parseFloat(co2Offset.toFixed(2))
        ];
        breakdownChartInstance.update();

        benchmarkChartInstance.data.labels = isEs
            ? ['Tu Huella', 'Promedio Colegio', 'Meta Eco']
            : ['Your Footprint', 'School Avg', 'Eco Goal'];
        benchmarkChartInstance.data.datasets[0].data = [
            parseFloat(netCo2.toFixed(1)),
            12.5,
            3.5
        ];
        benchmarkChartInstance.update();
    }

    function renderRecommendations(netCo2, co2Trans, co2Paper, recycledCount) {
        const container = document.getElementById('tipsContainer');
        container.innerHTML = '';
        const tips = [];
        const isEs = state.lang === 'es';

        if (state.transportMode === 'car' && state.distance > 20) {
            tips.push({
                icon: 'fa-car-side',
                color: 'text-rose-600 bg-rose-50 border-rose-200',
                title: isEs ? 'Organiza Carpooling con compañeros' : 'Organize Carpooling with classmates',
                desc: isEs 
                    ? `Compartir auto 2 días a la semana reduciría tu huella en aprox. ${(co2Trans * 0.4).toFixed(1)} kg CO₂e.`
                    : `Sharing rides 2 days a week would reduce your footprint by approx. ${(co2Trans * 0.4).toFixed(1)} kg CO₂e.`
            });
        } else if (state.transportMode === 'bus') {
            tips.push({
                icon: 'fa-bus',
                color: 'text-blue-600 bg-blue-50 border-blue-200',
                title: isEs ? 'Uso Eficiente del Bus Escolar' : 'Efficient School Bus Commute',
                desc: isEs 
                    ? 'Estás optimizando el transporte colectivo. ¡Anima a más compañeros a usar la ruta!'
                    : 'You are optimizing group transport. Encourage more classmates to ride the route!'
            });
        } else if (state.transportMode === 'walk') {
            tips.push({
                icon: 'fa-person-biking',
                color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
                title: isEs ? '¡Movilidad Cero Emisiones!' : 'Zero Emission Mobility!',
                desc: isEs 
                    ? 'Tu método de transporte no genera gases de efecto invernadero. ¡Excelente impacto!'
                    : 'Your transport mode generates zero greenhouse gases. Outstanding impact!'
            });
        }

        if (state.paperSheets > 40) {
            tips.push({
                icon: 'fa-copy',
                color: 'text-amber-600 bg-amber-50 border-amber-200',
                title: isEs ? 'Digitalización de Apuntes' : 'Note Digitalization',
                desc: isEs 
                    ? `Consumes ${state.paperSheets} hojas/semana. Utiliza cuadernos digitales o imprime por ambos lados.`
                    : `You use ${state.paperSheets} sheets/week. Use digital notebooks or double-sided printing.`
            });
        }

        if (recycledCount < 3) {
            tips.push({
                icon: 'fa-recycle',
                color: 'text-teal-700 bg-teal-50 border-teal-200',
                title: isEs ? 'Amplía la Separación en la Fuente' : 'Expand Waste Separation',
                desc: isEs 
                    ? 'Activa el reciclaje de orgánicos o electrónicos en los puntos ecológicos para ganar +15 Eco-Points.'
                    : 'Activate organic or e-waste recycling at eco-stations to gain +15 Eco-Points.'
            });
        }

        if (tips.length === 0 || netCo2 < 2.0) {
            tips.push({
                icon: 'fa-seedling',
                color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
                title: isEs ? 'Líder en Sostenibilidad Bolívar' : 'Bolívar Sustainability Leader',
                desc: isEs 
                    ? '¡Tu huella es excepcionalmente baja! Comparte tus hábitos e inspira a tu grupo escolar.'
                    : 'Your footprint is exceptionally low! Share your habits and inspire your school group.'
            });
        }

        tips.forEach(t => {
            const card = document.createElement('div');
            card.className = `p-3.5 rounded-2xl border ${t.color} flex items-start space-x-3 transition`;
            card.innerHTML = `
                <div class="mt-0.5 text-base shrink-0">
                    <i class="fa-solid ${t.icon}"></i>
                </div>
                <div class="space-y-0.5">
                    <div class="text-xs font-bold text-slate-900">${t.title}</div>
                    <div class="text-[11px] text-slate-600 leading-snug">${t.desc}</div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    function populateCertificateData(netCo2, ecoPoints, co2Trans, co2Paper, co2Offset) {
        const isEs = state.lang === 'es';
        document.getElementById('certDateVal').textContent = new Date().toLocaleDateString(isEs ? 'es-CO' : 'en-US');
        document.getElementById('certRoleVal').textContent = state.role.toUpperCase();

        document.getElementById('certCo2Val').textContent = `${netCo2.toFixed(1)} kg`;
        document.getElementById('certPointsVal').textContent = `${ecoPoints} / 100`;
        document.getElementById('certBadgeTitle').innerHTML = document.getElementById('badgeTitleText').innerHTML;

        const tbody = document.getElementById('certTableBody');
        tbody.innerHTML = '';

        const transFactor = EMISSION_FACTORS.transport[state.transportMode];
        const paperFactor = EMISSION_FACTORS.paper[state.paperType];
        const activeRecycledCount = Object.values(state.recycling).filter(Boolean).length;

        const rows = [
            {
                cat: isEs ? 'Transporte Principal' : 'Primary Transport',
                habit: `${state.transportMode.toUpperCase()} (${state.distance} km/sem)`,
                factor: `${transFactor.toFixed(3)} kg CO₂/km`,
                co2: `+${co2Trans.toFixed(2)} kg`
            },
            {
                cat: isEs ? 'Consumo Papel' : 'Paper Usage',
                habit: `${state.paperSheets} ${isEs ? 'hojas' : 'sheets'} (${state.paperType})`,
                factor: `${paperFactor.toFixed(3)} kg CO₂/hoja`,
                co2: `+${co2Paper.toFixed(2)} kg`
            },
            {
                cat: isEs ? 'Mitigación Reciclaje' : 'Recycling Offset',
                habit: `${activeRecycledCount} ${isEs ? 'categorías activas' : 'active categories'}`,
                factor: `-0.50 kg CO₂ / cat`,
                co2: `-${co2Offset.toFixed(2)} kg`
            }
        ];

        rows.forEach(r => {
            const tr = document.createElement('tr');
            tr.className = "border-b border-slate-200 text-slate-700";
            tr.innerHTML = `
                <td class="p-2 font-bold">${r.cat}</td>
                <td class="p-2">${r.habit}</td>
                <td class="p-2 font-mono text-[11px]">${r.factor}</td>
                <td class="p-2 text-right font-mono font-bold">${r.co2}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    // 6. i18n & UI STRINGS UPDATE
    function updateUIStrings() {
        const dict = i18n[state.lang];
        Object.keys(dict).forEach(key => {
            if (key === 'badges') return;
            const el = document.getElementById(key);
            if (el) el.textContent = dict[key];
        });

        document.getElementById('optVirgin').textContent = dict.optVirgin;
        document.getElementById('optRecycled').textContent = dict.optRecycled;
        document.getElementById('currentLangTag').textContent = state.lang.toUpperCase();
        document.getElementById('altLangTag').textContent = state.lang === 'es' ? 'EN' : 'ES';
    }

    function setLanguage(newLang) {
        state.lang = newLang;
        document.getElementById('langSelect').value = newLang;
        updateUIStrings();
        recalculate();
    }

    function setTransportMode(mode) {
        state.transportMode = mode;
        ['walk', 'bus', 'carpool', 'car'].forEach(m => {
            const btn = document.getElementById(`mode${m.charAt(0).toUpperCase() + m.slice(1)}`);
            if (btn) {
                if (m === mode) btn.classList.add('active');
                else btn.classList.remove('active');
            }
        });

        const factor = EMISSION_FACTORS.transport[mode];
        document.getElementById('transFactorHint').textContent = `${factor.toFixed(3)} kg CO₂/km`;
        recalculate();
    }

    function loadPreset(type) {
        if (type === 'eco') {
            state.transportMode = 'walk';
            state.distance = 15;
            state.paperSheets = 10;
            state.paperType = 'recycled';
            state.recycling = { plastic: true, paper: true, organic: true, ewaste: true };
            state.habits = { bottle: true, offDevices: true };
        } else if (type === 'average') {
            state.transportMode = 'bus';
            state.distance = 40;
            state.paperSheets = 35;
            state.paperType = 'virgin';
            state.recycling = { plastic: true, paper: true, organic: false, ewaste: false };
            state.habits = { bottle: true, offDevices: false };
        } else if (type === 'high') {
            state.transportMode = 'car';
            state.distance = 110;
            state.paperSheets = 85;
            state.paperType = 'virgin';
            state.recycling = { plastic: false, paper: false, organic: false, ewaste: false };
            state.habits = { bottle: false, offDevices: false };
        }
        syncFormWithState();
        recalculate();
    }

    function syncFormWithState() {
        setTransportMode(state.transportMode);
        document.getElementById('distanceInput').value = state.distance;
        document.getElementById('distanceSlider').value = state.distance;
        document.getElementById('paperInput').value = state.paperSheets;
        document.getElementById('paperSlider').value = state.paperSheets;
        document.getElementById('paperTypeSelect').value = state.paperType;

        document.getElementById('checkPlastic').checked = state.recycling.plastic;
        document.getElementById('checkPaper').checked = state.recycling.paper;
        document.getElementById('checkOrganic').checked = state.recycling.organic;
        document.getElementById('checkEwaste').checked = state.recycling.ewaste;

        document.getElementById('checkBottle').checked = state.habits.bottle;
        document.getElementById('checkOff').checked = state.habits.offDevices;
    }

    // 7. DECOUPLED EVENT LISTENERS
    document.getElementById('langSelect').addEventListener('change', (e) => setLanguage(e.target.value));
    document.getElementById('toggleLangBtn').addEventListener('click', () => {
        setLanguage(state.lang === 'es' ? 'en' : 'es');
    });
    document.getElementById('userRoleSelect').addEventListener('change', (e) => {
        state.role = e.target.value;
        recalculate();
    });

    // Presets
    document.getElementById('presetEco').addEventListener('click', () => loadPreset('eco'));
    document.getElementById('presetAverage').addEventListener('click', () => loadPreset('average'));
    document.getElementById('presetHigh').addEventListener('click', () => loadPreset('high'));

    // Transport buttons
    document.getElementById('modeWalk').addEventListener('click', () => setTransportMode('walk'));
    document.getElementById('modeBus').addEventListener('click', () => setTransportMode('bus'));
    document.getElementById('modeCarpool').addEventListener('click', () => setTransportMode('carpool'));
    document.getElementById('modeCar').addEventListener('click', () => setTransportMode('car'));

    // Distance controls sync
    const distInput = document.getElementById('distanceInput');
    const distSlider = document.getElementById('distanceSlider');
    distInput.addEventListener('input', (e) => {
        state.distance = Math.max(0, parseInt(e.target.value) || 0);
        distSlider.value = state.distance;
        recalculate();
    });
    distSlider.addEventListener('input', (e) => {
        state.distance = parseInt(e.target.value) || 0;
        distInput.value = state.distance;
        recalculate();
    });

    // Paper controls sync
    const paperInput = document.getElementById('paperInput');
    const paperSlider = document.getElementById('paperSlider');
    paperInput.addEventListener('input', (e) => {
        state.paperSheets = Math.max(0, parseInt(e.target.value) || 0);
        paperSlider.value = state.paperSheets;
        recalculate();
    });
    paperSlider.addEventListener('input', (e) => {
        state.paperSheets = parseInt(e.target.value) || 0;
        paperInput.value = state.paperSheets;
        recalculate();
    });
    document.getElementById('paperTypeSelect').addEventListener('change', (e) => {
        state.paperType = e.target.value;
        recalculate();
    });

    // Checkboxes
    ['checkPlastic', 'checkPaper', 'checkOrganic', 'checkEwaste'].forEach(id => {
        document.getElementById(id).addEventListener('change', () => {
            state.recycling.plastic = document.getElementById('checkPlastic').checked;
            state.recycling.paper = document.getElementById('checkPaper').checked;
            state.recycling.organic = document.getElementById('checkOrganic').checked;
            state.recycling.ewaste = document.getElementById('checkEwaste').checked;
            recalculate();
        });
    });

    ['checkBottle', 'checkOff'].forEach(id => {
        document.getElementById(id).addEventListener('change', () => {
            state.habits.bottle = document.getElementById('checkBottle').checked;
            state.habits.offDevices = document.getElementById('checkOff').checked;
            recalculate();
        });
    });

    // Buttons
    document.getElementById('btnCalcular').addEventListener('click', recalculate);
    document.getElementById('btnReset').addEventListener('click', () => loadPreset('average'));
    document.getElementById('btnExport').addEventListener('click', () => {
        recalculate();
        window.print();
    });

    // Bootstrapping
    initCharts();
    updateUIStrings();
    recalculate();
});