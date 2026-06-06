from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


def generar_tabla(monto, tasa_anual, plazo):
    tasa_mensual = tasa_anual / 100 / 12
    amort_ordinaria = round(monto / plazo, 2)
    saldo = round(monto, 2)
    tabla = []

    for i in range(1, plazo + 1):
        if i < plazo:
            amort = amort_ordinaria
        else:
            amort = round(saldo, 2)

        interes_total = round(saldo * tasa_mensual, 2)
        interes_neto = round(interes_total / 1.16, 2)
        iva = round(interes_neto * 0.16, 2)
        pago_total = round(amort + interes_neto + iva, 2)

        fila = {
            "periodo": i,
            "saldoInsoluto": round(saldo, 2),
            "amortizacion": amort,
            "interesNeto": interes_neto,
            "iva": iva,
            "pagoTotal": pago_total,
        }
        tabla.append(fila)

        saldo = round(saldo - amort, 2)

    return tabla


@app.route("/api/simular", methods=["POST"])
def simular():
    data = request.get_json()
    monto = float(data.get("monto", 0))
    tasa_anual = float(data.get("tasaAnual", 0))
    plazo = int(data.get("plazo", 0))

    if monto <= 0 or tasa_anual <= 0 or plazo <= 0:
        return jsonify({"error": "Datos inválidos"}), 400

    tabla = generar_tabla(monto, tasa_anual, plazo)
    return jsonify({"tabla": tabla})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
