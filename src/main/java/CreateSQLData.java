package src.main.java;

import com.microsoft.sqlserver.jdbc.SQLServerDataSource;
import com.microsoft.sqlserver.jdbc.SQLServerException;

import java.io.File;
import java.nio.file.FileVisitOption;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.attribute.BasicFileAttributes;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Stream;

public class CreateSQLData {

    private static final SQLServerDataSource DATA_SOURCE = new SQLServerDataSource();
    public static final String PLOTFILES_DIRECTORY = "src/main/resources/testdata/U";
    private static final Set<String> PROJECT_NUMBERS = new HashSet<>();
    private static final HashMap<String, Set<String>> PROJECT_NUMBER_TO_PLOTFILE_PATHS = new HashMap<>();

    public static void main(String[] args) {
//        connectToSQLServer();
        PROJECT_NUMBERS.clear();
        readCADProjectsFromU();
        System.out.println(PROJECT_NUMBERS);
        readPlotfilePathsFromU();
        System.out.println(PROJECT_NUMBER_TO_PLOTFILE_PATHS);

//        try (Connection con = DATA_SOURCE.getConnection();
//             PreparedStatement pstmt = con.prepareStatement("SELECT * FROM projects");
//             ResultSet rs = pstmt.executeQuery()) {
//
//            while (rs.next()) {
//                String projectNr = rs.getString("project_nr");
//                String contractor = rs.getString("contractor");
//                String projectManager = rs.getString("project_manager");
//                String cadProjectSupervisor = rs.getString("cad_project_supervisor");
//
//                System.out.println("Project Nr: " + projectNr);
//                System.out.println("Contractor: " + contractor);
//                System.out.println("Project Manager: " + projectManager);
//                System.out.println("CAD Project Supervisor: " + cadProjectSupervisor);
//                System.out.println("------------------------------");
//            }
//        } catch (SQLException e) {
//            e.printStackTrace();
//        }

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

    public static void readCADProjectsFromU() {
        // Muster für die Projektnummern (xxxx oder xxxxx)
        Pattern pattern = Pattern.compile("\\d{4,5}");

        try {
            Files.walkFileTree(Paths.get(PLOTFILES_DIRECTORY), EnumSet.noneOf(FileVisitOption.class), Integer.MAX_VALUE,
                new SimpleFileVisitor<>() {
                    @Override
                    public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs) {
                        String dirName = dir.getFileName().toString();

                        // Projektnummer aus dem Verzeichnisnamen extrahieren
                        Matcher matcher = pattern.matcher(dirName);
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
            // Für jede Projektnummer den Unterordner "frei" durchsuchen
            for (String projectNumber : PROJECT_NUMBERS) {
                Path basePath = Paths.get(PLOTFILES_DIRECTORY);
                Path projectPath = basePath.resolve(projectNumber).resolve("frei");

                // PDF-Dateien im Unterordner "frei" durchsuchen
                try (Stream<Path> pdfFiles = Files.walk(projectPath)) {
                    pdfFiles.filter(Files::isRegularFile)
                        .filter(path -> path.toString().toLowerCase().endsWith(".pdf"))
                        .forEach(pdfFile -> {
                            // Pfad und Projektnummer in die Tabelle einfügen
                            if (!PROJECT_NUMBER_TO_PLOTFILE_PATHS.containsKey(projectNumber)) {
                                PROJECT_NUMBER_TO_PLOTFILE_PATHS.put(projectNumber, new HashSet<>());
                            }
                            PROJECT_NUMBER_TO_PLOTFILE_PATHS.get(projectNumber).add(pdfFile.toString());
                            // insertDataIntoTable(connection, projectNumber, pdfFile.toString());
                        });
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}