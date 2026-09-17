function toTitleCase(str) {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}

function applyCheckboxValidation(sheet, row) {
  const checkboxRange = sheet.getRange(row, 3, 1, 7);
  const rule = SpreadsheetApp.newDataValidation().requireCheckbox().build();
  checkboxRange.setDataValidation(rule);
  checkboxRange.setFontColor("#9AA0A6");
}

function onEdit(e) {
  const sheet = e.range.getSheet();
  if (sheet.getName() !== "Responses") return;

  const row = e.range.getRow();
  const col = e.range.getColumn();

  if (col === 2 && row >= 2 && row <= 500) {
    const nameVal = e.range.getValue();
    const checkboxRange = sheet.getRange(row, 3, 1, 7);

    if (nameVal !== "" && nameVal !== null) {
      const rule = SpreadsheetApp.newDataValidation()
        .requireCheckbox()
        .build();
      checkboxRange.setDataValidation(rule);
      checkboxRange.setFontColor("#9AA0A6");

      const values = checkboxRange.getValues()[0];
      const newValues = values.map(val => (typeof val === 'boolean' ? val : false));
      checkboxRange.setValues([newValues]);
    } else {
      checkboxRange.clearDataValidations();
      checkboxRange.clearContent();
    }
  }
}

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("Responses");
    const data = JSON.parse(e.postData.contents);

    Logger.log(JSON.stringify(data));

    data.members.forEach(member => {
      const displayName = toTitleCase(member.name);
      const rowData = [
        member.guestId,
        displayName,
        member.events.haldi,
        member.events.sangeet,
        member.events.baraat,
        member.events.weddingCeremony,
        member.events.cocktailDinner,
        member.events.cocktailHour,
        member.events.dinner,
        member.dietaryRestrictions || "",
      ];

      const dataRange = sheet.getDataRange().getValues();
      let existingRow = -1;
      for (let i = 1; i < dataRange.length; i++) {
        if (dataRange[i][0] === member.guestId) {
          existingRow = i + 1;
          break;
        }
      }

      if (existingRow > 0) {
        sheet.getRange(existingRow, 1, 1, rowData.length).setValues([rowData]);
        applyCheckboxValidation(sheet, existingRow);
      } else {
        sheet.appendRow(rowData);
        applyCheckboxValidation(sheet, sheet.getLastRow());
      }
    });

    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log("ERROR: " + err.message);
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
