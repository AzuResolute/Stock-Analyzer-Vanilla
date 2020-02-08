import static spark.Spark.*;
import com.google.gson.*;

import java.awt.*;
import java.io.File;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpClient;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class sparkServer {
    public static void main(String [] args){

        String aburl = "C:\\Users\\roger\\Documents\\Projects\\MThree\\stockanalyzer_vanilla\\frontend\\test.html";
        String relurl = "../../../../../../../../frontend/test.html";

        try {
            File htmlFile = new File("C:\\Users\\roger\\Documents\\Projects\\MThree\\stockanalyzer_vanilla\\frontend\\test.html");
            Desktop.getDesktop().browse(htmlFile.toURI());
        } catch (Exception ex) {
            System.err.println("wrong path");
        }

        get("/getWeekly", (req, res) -> {
                    String result = String.join("\n", new Seed().WEEKLYSTRINGIFIED);
                    System.out.println(result);
                    return result;
                }
        );

        get("/getWeekly/:week", (req, res) -> {
                    getStock gs = new getStock();
                    String week = req.params(":week");
                    System.out.println("Week Selected: " + week);
                    String[] stringifiedArray = new Seed().WEEKLYSTRINGIFIED;
                    String result = Stream.of(stringifiedArray).filter(w -> w.contains(week)).findFirst().get();
                    System.out.println(result);
                    return result;
                }
        );

        get("/getIntraday/:minute", (req, res) -> {
                    getStock gs = new getStock();
                    String minute = req.params(":minute");
                    System.out.println("Minute Selected: " + minute);
                    String[] stringifiedArray = new Seed().INTRADAYSTRINGIFIED;
                    String result = Stream.of(stringifiedArray).filter(m -> m.contains(minute)).findFirst().get();
                    System.out.println(result);
                    return result;
                }
        );

        get("/getDaily", (req, res) -> {
                    String result = new getStock().getDaily();
                    System.out.println(result);
                    return result;
                }
        );

        before((req, res) -> {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "*");
            res.type("application/json");
        });
    }


//  GET JSON
//
//        get("/getWeekly", (req, res) -> {
//                    String result = new getStock().getWeekly();
//                    System.out.println(result);
//                    return result;
//                }
//        );
//
//        get("/getIntraday", (req, res) -> {
//                    String result = new getStock().getIntraday();
//                    System.out.println(result);
//                    return result;
//                }
//        );
}
