package pi.turathai.turathaibackend.Services;

import com.itextpdf.text.*;
import com.itextpdf.text.Font;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pi.turathai.turathaibackend.Entites.Itinery;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.List;

@Service
public class ExportService {

    @Autowired
    private ItenaryService itenaryService;

    public byte[] exportItinerariesToPdf() throws DocumentException, IOException {
        List<Itinery> itineraries = itenaryService.getAll();

        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        PdfWriter.getInstance(document, out);
        document.open();

        // Add title
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
        Paragraph title = new Paragraph("Itineraries Report", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);
        document.add(Chunk.NEWLINE);

        // Create table
        PdfPTable table = new PdfPTable(5); // 5 columns
        table.setWidthPercentage(100);

        // Table headers
        String[] headers = {"ID", "Description", "Start Date", "End Date", "Budget"};
        for (String header : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
            cell.setPadding(5);
            table.addCell(cell);
        }

        // Table data
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        for (Itinery itinery : itineraries) {
            table.addCell(String.valueOf(itinery.getId()));
            table.addCell(itinery.getDescription());
            table.addCell(dateFormat.format(itinery.getStartDate()));
            table.addCell(dateFormat.format(itinery.getEndDate()));
            table.addCell("$" + itinery.getBudget());
        }

        document.add(table);
        document.close();

        return out.toByteArray();
    }

    public byte[] exportItinerariesToExcel() throws IOException {
        List<Itinery> itineraries = itenaryService.getAll();

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Itineraries");

        // Create header row
        Row headerRow = sheet.createRow(0);
        CellStyle headerStyle = workbook.createCellStyle();
        org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerStyle.setFont(headerFont);

        String[] columns = {"ID", "Description", "Start Date", "End Date", "Budget"};
        for (int i = 0; i < columns.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(columns[i]);
            cell.setCellStyle(headerStyle);
        }

        // Fill data rows
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        int rowNum = 1;
        for (Itinery itinery : itineraries) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(itinery.getId());
            row.createCell(1).setCellValue(itinery.getDescription());

            // Handle null start date
            if (itinery.getStartDate() != null) {
                row.createCell(2).setCellValue(dateFormat.format(itinery.getStartDate()));
            } else {
                row.createCell(2).setCellValue("N/A");
            }

            // Handle null end date
            if (itinery.getEndDate() != null) {
                row.createCell(3).setCellValue(dateFormat.format(itinery.getEndDate()));
            } else {
                row.createCell(3).setCellValue("N/A");
            }

            row.createCell(4).setCellValue(itinery.getBudget());
        }

        // Adjust column width
        for (int i = 0; i < columns.length; i++) {
            sheet.autoSizeColumn(i);
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.write(out);
        workbook.close();

        return out.toByteArray();
    }
}