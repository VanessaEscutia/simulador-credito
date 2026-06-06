(function () {
  const IVA = 0.16;

  const montoInput = document.getElementById('monto');
  const tasaInput = document.getElementById('tasa');
  const plazoSelect = document.getElementById('plazo');
  const btnCalcular = document.getElementById('btn-calcular');
  const btnExcel = document.getElementById('btn-excel');
  const btnPdf = document.getElementById('btn-pdf');
  const btnImprimir = document.getElementById('btn-imprimir');
  const tablaBody = document.getElementById('tabla-body');
  const resultadoSection = document.getElementById('resultado-section');

  function formatearMoneda(valor) {
    return '$' + valor.toFixed(2);
  }

  function calcularAmortizacion() {
    const montoCredito = parseFloat(montoInput.value);
    const tasaAnual = parseFloat(tasaInput.value);
    const plazoMeses = parseInt(plazoSelect.value, 10);

    if (!montoCredito || montoCredito <= 0) {
      alert('Ingrese un monto válido.');
      return;
    }
    if (!tasaAnual || tasaAnual <= 0) {
      alert('Ingrese una tasa de interés válida.');
      return;
    }

    let saldoInsoluto = montoCredito;

    tablaBody.innerHTML = '';

    for (let periodo = 1; periodo <= plazoMeses; periodo++) {
      const interesTotalMensual = saldoInsoluto * ((tasaAnual / 100) / 12);
      const interesNeto = interesTotalMensual / 1.16;
      const ivaSobreInteres = interesNeto * 0.16;

      const esUltimoMes = periodo === plazoMeses;
      const amortizacionCapital = esUltimoMes ? saldoInsoluto : montoCredito / plazoMeses;

      const pagoMensualTotal = amortizacionCapital + interesNeto + ivaSobreInteres;

      const fila = document.createElement('tr');

      const celdaPeriodo = document.createElement('td');
      celdaPeriodo.textContent = periodo;
      fila.appendChild(celdaPeriodo);

      const celdaSaldo = document.createElement('td');
      celdaSaldo.textContent = formatearMoneda(saldoInsoluto);
      fila.appendChild(celdaSaldo);

      const celdaAmort = document.createElement('td');
      celdaAmort.textContent = formatearMoneda(amortizacionCapital);
      fila.appendChild(celdaAmort);

      const celdaInteres = document.createElement('td');
      celdaInteres.textContent = formatearMoneda(interesNeto);
      fila.appendChild(celdaInteres);

      const celdaIva = document.createElement('td');
      celdaIva.textContent = formatearMoneda(ivaSobreInteres);
      fila.appendChild(celdaIva);

      const celdaPago = document.createElement('td');
      celdaPago.textContent = formatearMoneda(pagoMensualTotal);
      fila.appendChild(celdaPago);

      tablaBody.appendChild(fila);

      saldoInsoluto -= amortizacionCapital;
    }

    resultadoSection.style.display = 'block';
    resultadoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function exportarExcel() {
    const tabla = document.getElementById('tabla-amortizacion');
    if (!tabla || tabla.style.display === 'none') {
      alert('Primero calcule la simulación antes de exportar.');
      return;
    }
    const wb = XLSX.utils.table_to_book(tabla, { sheet: 'Amortización' });
    XLSX.writeFile(wb, 'Simulacion_Credito.xlsx');
  }

  function descargarPdf() {
    const tabla = document.getElementById('tabla-amortizacion');
    if (!tabla || tabla.style.display === 'none') {
      alert('Primero calcule la simulación antes de exportar.');
      return;
    }
    const elemento = tabla.cloneNode(true);
    elemento.style.width = '100%';

    const contenedor = document.createElement('div');
    contenedor.style.padding = '20px';
    contenedor.style.fontFamily = 'Segoe UI, Arial, sans-serif';

    const titulo = document.createElement('h2');
    titulo.style.color = '#003673';
    titulo.style.textAlign = 'center';
    titulo.style.marginBottom = '20px';
    titulo.textContent = 'Simulación de Crédito - Banamex';
    contenedor.appendChild(titulo);

    const estilos = document.createElement('style');
    estilos.textContent = `
      table { width: 100%; border-collapse: collapse; font-size: 11px; }
      th { background: #003673; color: #fff; padding: 8px 10px; text-align: center; }
      th:not(:first-child) { text-align: right; }
      td { padding: 6px 10px; border-bottom: 1px solid #ddd; }
      td:first-child { text-align: center; font-weight: 600; }
      td:not(:first-child) { text-align: right; }
      tr:nth-child(even) { background: #f8faff; }
      tr:last-child { font-weight: 700; background: #eaf3fa; }
    `;
    contenedor.appendChild(estilos);
    contenedor.appendChild(elemento);

    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: 'Simulacion_Credito.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
    };

    html2pdf().set(opt).from(contenedor).save();
  }

  function imprimirPantalla() {
    window.print();
  }

  btnCalcular.addEventListener('click', calcularAmortizacion);
  btnExcel.addEventListener('click', exportarExcel);
  btnPdf.addEventListener('click', descargarPdf);
  btnImprimir.addEventListener('click', imprimirPantalla);
})();
