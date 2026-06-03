
/**
 * ENOS Guayas 2.1 - Plantilla de automatización conceptual
 * Propósito: Kobo -> Google Sheets -> OpenAI API -> Google Docs -> Drive -> Trazabilidad
 * No incluye tokens ni credenciales. Configurar en PropertiesService.
 *
 * Variables esperadas en Script Properties:
 * KOBO_TOKEN
 * OPENAI_API_KEY
 * TEMPLATE_DOC_ID
 * OUTPUT_FOLDER_ID
 * TRACEABILITY_SHEET_ID
 */

function generarDocumentoENOS(canton, tipoProducto) {
  const codigo = generarCodigoControl(canton, tipoProducto);
  const datos = obtenerDatosConsolidados(canton);
  const analisis = generarAnalisisOpenAI(datos, tipoProducto, codigo);
  const docUrl = llenarPlantillaGoogleDocs(codigo, canton, tipoProducto, datos, analisis);
  registrarTrazabilidad(codigo, tipoProducto, canton, datos, docUrl);
  return {codigo: codigo, documento: docUrl};
}

function generarCodigoControl(canton, tipoProducto) {
  const fecha = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd");
  const seq = Utilities.formatString("%03d", obtenerSecuencialDiario());
  const cantonClean = String(canton || "CANTON").toUpperCase().replace(/[^A-Z0-9]/g, "");
  const tipo = String(tipoProducto || "PLAN").toUpperCase().substring(0, 4);
  return `ENOS-GYE-${cantonClean}-${tipo}-${fecha}-${seq}-V01`;
}

function obtenerSecuencialDiario() {
  const props = PropertiesService.getScriptProperties();
  const key = "SEQ_" + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd");
  const current = Number(props.getProperty(key) || "0") + 1;
  props.setProperty(key, String(current));
  return current;
}

function obtenerDatosConsolidados(canton) {
  // Opción A: leer desde Google Sheets consolidado.
  // Opción B: consultar Kobo API por asset/formulario.
  // Esta función debe devolver un objeto estructurado por ejes:
  return {
    canton: canton,
    fecha_corte: new Date().toISOString(),
    puntos_criticos: [],
    infraestructura: [],
    capacidades: [],
    acciones: [],
    seguimiento: [],
    brechas: []
  };
}

function generarAnalisisOpenAI(datos, tipoProducto, codigo) {
  const apiKey = PropertiesService.getScriptProperties().getProperty("OPENAI_API_KEY");
  if (!apiKey) {
    return {
      resumen_ejecutivo: "API no configurada. Generar análisis manual con GPT.",
      brechas: [],
      recomendaciones: [],
      acciones_prioritarias: []
    };
  }
  const prompt = `
Eres un asistente técnico ENOS. Genera un borrador técnico sujeto a revisión institucional.
Código: ${codigo}
Tipo producto: ${tipoProducto}
Datos consolidados: ${JSON.stringify(datos)}
Devuelve JSON con: resumen_ejecutivo, antecedentes, analisis_riesgo, brechas, acciones_prioritarias, recomendaciones, decisiones_requeridas.
`;
  const payload = {
    model: "gpt-4.1-mini",
    messages: [
      {role: "system", content: "Responde solo JSON válido."},
      {role: "user", content: prompt}
    ],
    temperature: 0.2
  };
  const response = UrlFetchApp.fetch("https://api.openai.com/v1/chat/completions", {
    method: "post",
    contentType: "application/json",
    headers: {Authorization: "Bearer " + apiKey},
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
  const body = JSON.parse(response.getContentText());
  try {
    return JSON.parse(body.choices[0].message.content);
  } catch (e) {
    return {resumen_ejecutivo: body.choices?.[0]?.message?.content || "Sin respuesta estructurada"};
  }
}

function llenarPlantillaGoogleDocs(codigo, canton, tipoProducto, datos, analisis) {
  const props = PropertiesService.getScriptProperties();
  const templateId = props.getProperty("TEMPLATE_DOC_ID");
  const folderId = props.getProperty("OUTPUT_FOLDER_ID");
  if (!templateId || !folderId) throw new Error("Configurar TEMPLATE_DOC_ID y OUTPUT_FOLDER_ID");
  const folder = DriveApp.getFolderById(folderId);
  const file = DriveApp.getFileById(templateId).makeCopy(`${codigo}_${tipoProducto}_${canton}`, folder);
  const doc = DocumentApp.openById(file.getId());
  const body = doc.getBody();
  const replacements = {
    "{{codigo_control}}": codigo,
    "{{fecha_generacion}}": Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm"),
    "{{canton}}": canton,
    "{{tipo_producto}}": tipoProducto,
    "{{resumen_ejecutivo}}": analisis.resumen_ejecutivo || "",
    "{{antecedentes}}": analisis.antecedentes || "",
    "{{analisis_riesgo}}": analisis.analisis_riesgo || "",
    "{{brechas}}": JSON.stringify(analisis.brechas || [], null, 2),
    "{{acciones_prioritarias}}": JSON.stringify(analisis.acciones_prioritarias || [], null, 2),
    "{{recomendaciones}}": JSON.stringify(analisis.recomendaciones || [], null, 2),
    "{{decisiones_requeridas}}": JSON.stringify(analisis.decisiones_requeridas || [], null, 2)
  };
  Object.keys(replacements).forEach(k => body.replaceText(k, replacements[k]));
  doc.saveAndClose();
  return file.getUrl();
}

function registrarTrazabilidad(codigo, tipoProducto, canton, datos, docUrl) {
  const sheetId = PropertiesService.getScriptProperties().getProperty("TRACEABILITY_SHEET_ID");
  if (!sheetId) return;
  const ss = SpreadsheetApp.openById(sheetId);
  const sh = ss.getSheetByName("Trazabilidad") || ss.insertSheet("Trazabilidad");
  if (sh.getLastRow() === 0) {
    sh.appendRow(["codigo_control","tipo_producto","canton","fecha_generacion","fecha_corte_datos","cantidad_registros","estado","enlace_docx"]);
  }
  const cantidad = (datos.puntos_criticos?.length || 0) + (datos.infraestructura?.length || 0) + (datos.capacidades?.length || 0) + (datos.acciones?.length || 0);
  sh.appendRow([codigo, tipoProducto, canton, new Date(), datos.fecha_corte, cantidad, "Borrador generado automáticamente", docUrl]);
}
