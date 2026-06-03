# Automatización ENOS Guayas 2.1

Este módulo contiene una plantilla conceptual de automatización. No incluye claves ni tokens.

Ruta esperada:
Kobo -> Google Sheets/base consolidada -> OpenAI API -> Google Docs/Word/PDF -> Drive -> Registro de trazabilidad.

Elementos requeridos para activar:
1. Tokens o credenciales Kobo.
2. Google Sheets consolidado.
3. Plantilla Google Docs con marcadores como {{codigo_control}}, {{resumen_ejecutivo}}, {{brechas}}.
4. Carpeta Drive de salida.
5. Clave OpenAI API.
6. Registro de trazabilidad.

Estado recomendado de los documentos generados:
Borrador generado automáticamente -> En revisión técnica -> Ajustado -> Validado -> Aprobado para remisión.
