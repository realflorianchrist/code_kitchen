import com.microsoft.sqlserver.jdbc.SQLServerDataSource;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.FileVisitOption;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.attribute.BasicFileAttributes;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Stream;

public class CreateSQLData {

    private static final SQLServerDataSource DATA_SOURCE = new SQLServerDataSource();
    public static final String PLOTFILES_DIRECTORY = "plan_directory/src/main/resources/testdata/U";
    private static final String PROJECT_DIRECTORY = "plan_directory/src/main/resources/testdata/K";
    private static final Set<String> PROJECT_NUMBERS = new HashSet<>();
    // Muster für die Projektnummern (xxxx oder xxxxx)
    private static final Pattern PROJECT_NUMBER_PATTERN = Pattern.compile("\\d{4,5}");
    private static final HashMap<String, Set<String>> PROJECT_NUMBER_TO_PLOTFILE_PATHS = new HashMap<>();
    private static final HashMap<String, String> PLAN_NUMBER_TO_PLOTFILE_PATH = new HashMap<>();
    private static final HashMap<String, String> PROJECT_NUMBER_TO_PROJECT_INFO = new HashMap<>();

    public static void main(String[] args) {
//        connectToSQLServer();
//        clearTables();
        readCADProjectsFromU();
//        readPlotfilePathsFromU();
//        printFoundPlotfiles();
        readProjectInfoFromK();
//        System.out.println(PROJECT_NUMBER_TO_PROJECT_INFO);
//        readExcelFile();
    }

    public static void connectToSQLServer() {
        // Create datasource.
        DATA_SOURCE.setUser("JavaUser");
        DATA_SOURCE.setPassword("Florian12");
        DATA_SOURCE.setServerName("localhost");
        DATA_SOURCE.setPortNumber(Integer.parseInt("1433"));
        DATA_SOURCE.setDatabaseName("plan_directory");
        DATA_SOURCE.setTrustServerCertificate(true);
    }

    public static void clearTables() {
        try (Connection connection = DATA_SOURCE.getConnection()) {
            clearTable(connection, "plotfiles");
            clearTable(connection, "plans");
            clearTable(connection, "projects");

            System.out.println("Tabellen erfolgreich geleert.");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static void clearTable(Connection connection, String tableName) throws SQLException {
        String sql = "DELETE FROM " + tableName;

        try (PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
            preparedStatement.executeUpdate();
        }
    }

    public static void readCADProjectsFromU() {
        try {
            Files.walkFileTree(Paths.get(PLOTFILES_DIRECTORY), EnumSet.noneOf(FileVisitOption.class), Integer.MAX_VALUE,
                new SimpleFileVisitor<>() {
                    @Override
                    public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs) {
                        String dirName = dir.getFileName().toString();

                        // Projektnummer aus dem Verzeichnisnamen extrahieren
                        Matcher matcher = PROJECT_NUMBER_PATTERN.matcher(dirName);
                        if (matcher.find()) {
                            String projectNumber = matcher.group();
                            if (!projectNumber.matches("[1-9]000") && !projectNumber.matches("[1-9][0-9]000")) {
                                PROJECT_NUMBERS.add(projectNumber);
                            }
                        }
                        return FileVisitResult.CONTINUE;
                    }
                });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void readPlotfilePathsFromU() {
        try {
            // Alle PDF-Dateien im Verzeichnis und seinen Unterordnern durchsuchen
            try (Stream<Path> pdfFiles = Files.walk(Paths.get(PLOTFILES_DIRECTORY))) {
                pdfFiles.filter(Files::isRegularFile)
                    .filter(path -> path.toString().toLowerCase().endsWith(".pdf"))
                    .forEach(pdfFile -> {
                        // Prüfen, ob der Ordner "frei" im Pfad enthalten ist
                        if (pdfFile.getParent().endsWith("frei")) {
                            String planNr = extractPlanNumberFromFileName(pdfFile.getFileName().toString());
                            if (planNr != null && !PLAN_NUMBER_TO_PLOTFILE_PATH.containsKey(planNr)) {
                                PLAN_NUMBER_TO_PLOTFILE_PATH.put(planNr, pdfFile.toString());
                                writePlanNrIntoPlansTable(planNr);
                                writePlotfileTable(planNr, pdfFile.toString());
                            }
                        }
                    });
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static String extractPlanNumberFromFileName(String fileName) {
        // Annahme: Dateiname hat das Format "f_<ProjektNr>_<PlanNr>(_,-)<Index>_<weitere Informationen>.pdf"
        String[] parts = fileName.split("_");
        if (parts.length >= 3) {
            String projectAndPlan = parts[2];

            String projectNr = parts[1];
            String planNr = parts[2];
            String index = parts[3];

            String[] projectAndPlanParts = projectAndPlan.split("-");
            if (projectAndPlanParts.length >= 2) {
                planNr = projectAndPlanParts[0];
                index = projectAndPlanParts[1];
            }

            return projectNr + "/" + planNr + "-" + index;
        }
        return null;
    }

    private static void writePlotfileTable(String planNr, String path) {
        try (Connection connection = DATA_SOURCE.getConnection()) {
            String sql = "INSERT INTO plotfiles (plan_path, plan_nr) VALUES (?, ?)";

            try (PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
                preparedStatement.setString(1, path);
                preparedStatement.setString(2, planNr);

                preparedStatement.executeUpdate();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private static void writePlanNrIntoPlansTable(String planNr) {
        try (Connection connection = DATA_SOURCE.getConnection()) {
            String sql = "INSERT INTO plans (plan_nr) VALUES (?)";

            try (PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
                preparedStatement.setString(1, planNr);

                preparedStatement.executeUpdate();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private static void printFoundPlotfiles() {
        for (Map.Entry<String, String> entry : PLAN_NUMBER_TO_PLOTFILE_PATH.entrySet()) {
            String planNumber = entry.getKey();
            String plotFilePath = entry.getValue();
            System.out.println("Plan-Nummer: " + planNumber);
            System.out.println("Gefundene PDF-Datei: " + plotFilePath);
            System.out.println();
        }
    }

    public static void readProjectInfoFromK() {
        Set<String> projNr = PROJECT_NUMBERS;
        try {
            Files.walkFileTree(Paths.get(PROJECT_DIRECTORY), EnumSet.noneOf(FileVisitOption.class), Integer.MAX_VALUE,
                new SimpleFileVisitor<>() {
                    @Override
                    public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs) {
                        String dirName = dir.getFileName().toString();

                        // Projektnummer aus dem Verzeichnisnamen extrahieren
                        Matcher matcher = PROJECT_NUMBER_PATTERN.matcher(dirName);
                        if (matcher.find()) {
                            String projectNumber = matcher.group();
                            if (projNr.contains(projectNumber) && searchProjectExcel(dir, projectNumber)) {
                                projNr.remove(projectNumber);
                            }
                        }
                        return FileVisitResult.CONTINUE;
                    }
                });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static boolean searchProjectExcel(Path projectDirectory, String projectNr) {
        try {
            // Suchmuster für die Excel-Dateien
            String[] filePatterns = {"öffnung", "oeffnung"};
            String[] extensions = {".xlsm", ".xlsx"};

            try (Stream<Path> paths = Files.walk(projectDirectory)) {
                Optional<Path> excelFile = paths
                    .filter(Files::isRegularFile)
                    .filter(path -> {
                        String fileName = path.getFileName().toString().toLowerCase();
                        for (String pattern : filePatterns) {
                            for (String extension : extensions) {
                                if (fileName.contains(pattern) && fileName.endsWith(extension)) {
                                    readExcelFile(path, projectNr);
                                    return true;
                                }
                            }
                        }
                        return false;
                    })
                    .findFirst();

                return excelFile.isPresent();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return false;
    }


    private static void readExcelFile(Path filePath, String projectNr) {
        try (FileInputStream fileInputStream = new FileInputStream(String.valueOf(filePath))) {
            Workbook workbook = new XSSFWorkbook(fileInputStream);
            Sheet targetSheet = getSheet(workbook);

            String contractor = getCellValue(targetSheet, 5, 2);
            String projectManager = getCellValue(targetSheet, 11, 2);
            String cadProjectSupervisor = getCellValue(targetSheet, 44, 5);

            insertIntoProjects(projectNr, contractor, projectManager, cadProjectSupervisor);

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private static Sheet getSheet(Workbook workbook) {
        Sheet targetSheet = null;
        for (int i = 0; i < workbook.getNumberOfSheets(); i++) {
            Sheet sheet = workbook.getSheetAt(i);
            String sheetName = sheet.getSheetName();
            if (sheetName.toLowerCase().startsWith(".index")
                || sheetName.toLowerCase().startsWith(".")
                || containsNumber(sheetName)) {
                targetSheet = sheet;
                break;
            }
        }

        if (targetSheet == null) {
            targetSheet = workbook.getSheetAt(0);
        }
        return targetSheet;
    }

    private static boolean containsNumber(String str) {
        for (char c : str.toCharArray()) {
            if (Character.isDigit(c)) {
                return true;
            }
        }
        return false;
    }

    private static String getCellValue(Sheet sheet, int rowNumber, int cellNumber) {
        Row row = sheet.getRow(rowNumber);
        if (row != null) {
            Cell cell = row.getCell(cellNumber);
            if (cell != null) {
                return cell.toString();
            }
        }
        return null;
    }

    private static void insertIntoProjects(String projectNr, String contractor,
                                           String projectManager, String cadProjectSupervisor) {

        try (Connection connection = DATA_SOURCE.getConnection()) {
            String sql = "INSERT INTO projects (project_nr, contractor, project_manager, cad_project_supervisor) " +
                "VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE contractor = ?, project_manager = ?, cad_project_supervisor = ?";

            try (PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
                preparedStatement.setString(1, projectNr);
                preparedStatement.setString(2, contractor);
                preparedStatement.setString(3, projectManager);
                preparedStatement.setString(4, cadProjectSupervisor);
                // Für das Update im Fall eines Duplikatschlüssels
                preparedStatement.setString(5, contractor);
                preparedStatement.setString(6, projectManager);
                preparedStatement.setString(7, cadProjectSupervisor);

                preparedStatement.executeUpdate();
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    /*
    public static void readPlotfilePathsFromU() {
        try {
            // Für jede Projektnummer den Unterordner "frei" suchen
            Map<String, Path> freiFolderPaths = findFreiFolderPaths();

            for (Map.Entry<String, Path> entry : freiFolderPaths.entrySet()) {
                String projectNumber = entry.getKey();
                Path freiFolderPath = entry.getValue();

                // PDF-Dateien im Unterordner "frei" durchsuchen
                try (Stream<Path> pdfFiles = Files.walk(freiFolderPath)) {
                    pdfFiles.filter(Files::isRegularFile)
                        .filter(path -> path.toString().toLowerCase().endsWith(".pdf"))
                        .forEach(pdfFile -> {
                            // Pfad und Projektnummer in die Tabelle einfügen
                            PROJECT_NUMBER_TO_PLOTFILE_PATHS
                                .computeIfAbsent(projectNumber, k -> new HashSet<>())
                                .add(pdfFile.toString());
                            // insertDataIntoTable(connection, projectNumber, pdfFile.toString());
                        });
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static Map<String, Path> findFreiFolderPaths() throws IOException {
        Map<String, Path> freiFolderPaths = new HashMap<>();

        for (String targetProjectNumber : PROJECT_NUMBERS) {
            List<Path> matchingDirectories = findMatchingDirectories(targetProjectNumber);
            if (!matchingDirectories.isEmpty()) {
                Path freiFolderPath = matchingDirectories.get(0).resolve("frei");
                freiFolderPaths.put(targetProjectNumber, freiFolderPath);
            }
        }

        return freiFolderPaths;
    }

    private static List<Path> findMatchingDirectories(String targetProjectNumber) throws IOException {
        return Files.walk(Paths.get(PLOTFILES_DIRECTORY))
            .filter(path -> path.toFile().isDirectory() && path.getFileName().toString().equals(targetProjectNumber))
            .toList();
    }

    private static void printFoundPlotfiles() {
        for (Map.Entry<String, Set<String>> entry : PROJECT_NUMBER_TO_PLOTFILE_PATHS.entrySet()) {
            String projectNumber = entry.getKey();
            Set<String> plotFilePaths = entry.getValue();
            System.out.println("Projektnummer: " + projectNumber);
            System.out.println("Gefundene PDF-Dateien:");
            for (String plotFilePath : plotFilePaths) {
                System.out.println(plotFilePath);
            }
            System.out.println();
        }
    } */



}