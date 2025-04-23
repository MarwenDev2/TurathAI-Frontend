package pi.turathai.turathaibackend.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pi.turathai.turathaibackend.Entites.Stop;
import pi.turathai.turathaibackend.Services.IStopService;

import java.util.List;

@CrossOrigin(origins= "http://Localhost:4200")
@RestController
@RequestMapping("/api/stops")
public class StopController {

    @Autowired
    private IStopService stopService;

    @PostMapping("/add")
    public Stop addStop(@RequestBody Stop stop) {
        return stopService.add(stop);
    }

    @PutMapping("/update")
    public Stop updateStop(@RequestBody Stop stop) {
        return stopService.update(stop);
    }

    @DeleteMapping("/remove/{id}")
    public void removeStop(@PathVariable long id) {
        stopService.remove(id);
    }

    @GetMapping("/get/{id}")
    public Stop getStopById(@PathVariable long id) {
        return stopService.getById(id);
    }

    @GetMapping("/all")
    public List<Stop> getAllStops() {
        return stopService.getAll();
    }
}