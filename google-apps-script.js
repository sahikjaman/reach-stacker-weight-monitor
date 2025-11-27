const SPREADSHEET_ID = '1lqBaXH5Lsvaa8Ry8vtJ6PEb5FfyjxtsHF3x9u3IWgqA';

function doGet(e) {
    Logger.log('doGet called with parameters: ' + JSON.stringify(e.parameter));
    const action = e.parameter.action;

    if (action === 'getUnits') {
        return getUnits();
    } else if (action === 'getUnit') {
        const unitName = e.parameter.unitName;
        const unit = getUnitByName(unitName);
        return ContentService.createTextOutput(JSON.stringify({
            success: true,
            unit: unit
        })).setMimeType(ContentService.MimeType.JSON);
    } else if (action === 'deleteUnit') {
        const unitName = e.parameter.unitName;
        const result = deleteUnit(unitName);
        return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: 'Invalid action'
    })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
    Logger.log('doPost called');
    try {
        if (!e || !e.postData || !e.postData.contents) {
            Logger.log('No post data');
            return ContentService.createTextOutput(JSON.stringify({
                success: false,
                message: 'No post data received'
            })).setMimeType(ContentService.MimeType.JSON);
        }
        Logger.log('Post data: ' + e.postData.contents);
        const data = JSON.parse(e.postData.contents);
        return saveUnit(data);
    } catch (error) {
        Logger.log('Error in doPost: ' + error.toString());
        return ContentService.createTextOutput(JSON.stringify({
            success: false,
            message: 'Error: ' + error.toString()
        })).setMimeType(ContentService.MimeType.JSON);
    }
}

// Fungsi untuk menyimpan data unit
function saveUnit(data) {
    Logger.log('saveUnit called with data: ' + JSON.stringify(data));
    try {
        const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
        let sheet = ss.getSheetByName('Units');

        // Buat sheet jika belum ada
        if (!sheet) {
            Logger.log('Creating new Units sheet');
            sheet = ss.insertSheet('Units');

            // Header
            const headers = [
                'Timestamp',
                'Unit Name',
                'Brand/Model',
                'Year',
                'Location',
                'Boom Length',
                'Horizontal Offset',
                'Pivot Height',
                'Extension Max',
                'Piston Diameter',
                'Mech Advantage',
                'Hydraulic Const',
                'Rigging Weight',
                'Load Chart Slope',
                'Load Chart Intercept',
                'Calib Factor',
                'Calib Offset',
                'R Squared',
                'Total Data Points',
                'Regression Data'
            ];

            sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
            sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
            sheet.getRange(1, 1, 1, headers.length).setBackground('#3498db');
            sheet.getRange(1, 1, 1, headers.length).setFontColor('#ffffff');
            sheet.setFrozenRows(1);
        }

        // Cek apakah unit sudah ada (update) atau baru (insert)
        const dataRange = sheet.getDataRange();
        const values = dataRange.getValues();
        let rowIndex = -1;

        for (let i = 1; i < values.length; i++) {
            if (values[i][1] === data.unit_name) {
                rowIndex = i + 1; // +1 karena array 0-indexed, sheet 1-indexed
                break;
            }
        }

        // Prepare row data
        const rowData = [
            new Date(),
            data.unit_name,
            data.unit_brand || '',
            data.unit_year || '',
            data.unit_location || '',
            parseFloat(data.boom_length),
            parseFloat(data.horizontal_offset),
            parseFloat(data.pivot_height),
            parseFloat(data.extension_max),
            parseFloat(data.piston_diameter),
            parseFloat(data.mech_advantage),
            parseFloat(data.hydraulic_const),
            parseFloat(data.rigging_weight),
            parseFloat(data.loadchart_slope),
            parseFloat(data.loadchart_intercept),
            parseFloat(data.calib_factor),
            parseFloat(data.calib_offset),
            parseFloat(data.r_squared),
            parseInt(data.total_data_points),
            data.regression_data || ''
        ];

        if (rowIndex > 0) {
            // Update existing row
            Logger.log('Updating existing row: ' + rowIndex);
            sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
        } else {
            // Append new row
            Logger.log('Appending new row');
            sheet.appendRow(rowData);
        }

        // Auto-resize columns
        sheet.autoResizeColumns(1, rowData.length);

        return ContentService.createTextOutput(JSON.stringify({
            success: true,
            message: 'Data berhasil disimpan',
            unit_name: data.unit_name
        })).setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        Logger.log('Error in saveUnit: ' + error.toString());
        return ContentService.createTextOutput(JSON.stringify({
            success: false,
            message: 'Error saving data: ' + error.toString()
        })).setMimeType(ContentService.MimeType.JSON);
    }
}

// Fungsi untuk mengambil semua data unit
function getUnits() {
    Logger.log('getUnits called');
    try {
        const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
        const sheet = ss.getSheetByName('Units');

        if (!sheet) {
            Logger.log('Sheet Units not found');
            return ContentService.createTextOutput(JSON.stringify({
                success: true,
                units: []
            })).setMimeType(ContentService.MimeType.JSON);
        }

        const dataRange = sheet.getDataRange();
        const values = dataRange.getValues();
        Logger.log('Total rows found: ' + values.length);

        if (values.length <= 1) {
            return ContentService.createTextOutput(JSON.stringify({
                success: true,
                units: []
            })).setMimeType(ContentService.MimeType.JSON);
        }

        const headers = values[0];
        const units = [];

        for (let i = 1; i < values.length; i++) {
            const unit = {};
            for (let j = 0; j < headers.length; j++) {
                const key = headers[j].toLowerCase().replace(/\s+/g, '_').replace(/\//g, '_');
                unit[key] = values[i][j];
            }
            units.push(unit);
        }

        Logger.log('Units parsed: ' + units.length);
        return ContentService.createTextOutput(JSON.stringify({
            success: true,
            units: units
        })).setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        Logger.log('Error in getUnits: ' + error.toString());
        return ContentService.createTextOutput(JSON.stringify({
            success: false,
            message: 'Error getting units: ' + error.toString()
        })).setMimeType(ContentService.MimeType.JSON);
    }
}

// Fungsi untuk mendapatkan unit tertentu berdasarkan nama
function getUnitByName(unitName) {
    try {
        const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
        const sheet = ss.getSheetByName('Units');

        if (!sheet) {
            return null;
        }

        const dataRange = sheet.getDataRange();
        const values = dataRange.getValues();
        const headers = values[0];

        for (let i = 1; i < values.length; i++) {
            if (values[i][1] === unitName) {
                const unit = {};
                for (let j = 0; j < headers.length; j++) {
                    const key = headers[j].toLowerCase().replace(/\s+/g, '_').replace(/\//g, '_');
                    unit[key] = values[i][j];
                }
                return unit;
            }
        }

        return null;

    } catch (error) {
        Logger.log('Error getting unit: ' + error.toString());
        return null;
    }
}

// Fungsi untuk menghapus unit
function deleteUnit(unitName) {
    try {
        const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
        const sheet = ss.getSheetByName('Units');

        if (!sheet) {
            return { success: false, message: 'Sheet not found' };
        }

        const dataRange = sheet.getDataRange();
        const values = dataRange.getValues();

        for (let i = 1; i < values.length; i++) {
            if (values[i][1] === unitName) {
                sheet.deleteRow(i + 1);
                return { success: true, message: 'Unit deleted successfully' };
            }
        }

        return { success: false, message: 'Unit not found' };

    } catch (error) {
        return { success: false, message: 'Error: ' + error.toString() };
    }
}
