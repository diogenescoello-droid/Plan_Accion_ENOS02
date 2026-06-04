PARCHE ENOS 2.1 - FALLA 4: SOLICITAR ACCESO AL REPOSITORIO DRIVE

Objetivo:
- Cambiar los botones de Drive que podían generar error, login o confusión.
- Mostrar la frase institucional: "Solicitar acceso al repositorio Drive".
- Enviar al usuario al formulario F10 de solicitud de acceso cuando se trate de repositorios restringidos.
- Ajustar la ruta de la matriz maestra al nombre simplificado: docs/matrices/matriz_maestra_enos_2_1.xlsx

Archivos incluidos:
- acceso.html
- cartografia.html
- biblioteca.html
- ejes.html
- dashboard.html
- automatizacion.html
- gpt.html
- validacion.html
- data/config.json

Dónde subir:
- Los HTML van en la raíz de Plan_Accion_ENOS02/.
- config.json va dentro de Plan_Accion_ENOS02/data/.

No borrar:
- docs/formularios/
- docs/matrices/
- docs/insumos_sprea/
- docs/cartografia/

Verificación:
1. Abrir acceso.html.
2. Confirmar botón: "Solicitar acceso al repositorio Drive".
3. Abrir cartografia.html.
4. Confirmar botón: "Solicitar acceso al repositorio Drive cartográfico".
5. Abrir biblioteca.html.
6. Confirmar botón: "Solicitar acceso a presentaciones SPREA en Drive".
7. Probar matriz maestra: docs/matrices/matriz_maestra_enos_2_1.xlsx.
