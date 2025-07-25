package pumpManagment.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.core.userdetails.User;
import pumpManagment.Entity.*;
import pumpManagment.model.AuthenticationRequest;
import pumpManagment.model.AuthenticationResponse;
import pumpManagment.model.DAOUser;
import pumpManagment.model.UserDTO;
import pumpManagment.repository.*;
import pumpManagment.service.ImageService;

import java.io.ByteArrayOutputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Properties;
import java.util.stream.Collectors;

import net.sf.jasperreports.engine.JREmptyDataSource;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.util.JRLoader;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import pumpManagment.config.CustomUserDetailsService;
import pumpManagment.config.JwtUtil;

import javax.servlet.http.HttpSession;
import javax.xml.ws.Response;

@RestController
@CrossOrigin("*")
@RequestMapping("/portal/api")
public class PurchaseController {

    //      private final static Log logger = LogFactory.getLog(PurchaseController.class);
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepositry user;

    @Autowired
    private PurchaseRepository purchaseRepository;

    @Autowired
    private PetrolSellRepository petrolSellRepository;

    @Autowired
    private OilSellRepository oilSellRepository;

    @Autowired
    private DipStockRepository dipStockRepository;

    @Autowired
    private ImageService imageService;

    @Autowired
    private kharchrepository kharchrepository;

    @Autowired
    feedbackRepository feed;

    @Autowired
    private DieselSellRepository dieselSellRepository;

    //    private final static Log logger = (Log) LogFactory.getLog(PurchaseController.class);
    @Autowired
    private PetrolSellRepository myRepository;

    @Autowired
    private customerRepository CustomerRepository;

    @Autowired
    private jamabakiRepository JamabakiRepository;

    @Autowired
    private dailytotalRepository DailytotalRepository;

    @Autowired
    private DipvalueRepository dipvalueRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private DailyskockRepository dailyskockRepository;

    @Autowired
    private DailydieselstockRepository dailydieselstockRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private moneyDetailsRepository MoneyDetailsRepository;

    @Autowired
    private ExpensesRepository expensesRepository;

    @Autowired
    private OilsellListRepository oilsellListRepository;

    @Autowired
    private XpPetorlRepository xpPetorlRepository;

    @Autowired
    private powerDieselRepository powerDieselRepository;

    @Autowired
    private extraDipStockRepository extraDipStockRepository;

    @Autowired
    private extraDipvalueRepository extraDipvalueRepository;



    //    Login Page
    @RequestMapping(value = "/authenticate", method = RequestMethod.POST)
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthenticationRequest authenticationRequest)
            throws Exception {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    authenticationRequest.getUsername(), authenticationRequest.getPassword()));
        } catch (DisabledException e) {
            throw new Exception("USER_DISABLED", e);
        } catch (BadCredentialsException e) {
            throw new Exception("INVALID_CREDENTIALS", e);
        }

        UserDetails userdetails = userDetailsService.loadUserByUsername(authenticationRequest.getUsername());
        String role = userdetails.getAuthorities().stream().findFirst().get().getAuthority();
        DAOUser user = userRepository.findByUsername(authenticationRequest.getUsername());
        Long userId = user.getId();
        String token = jwtUtil.generateToken(userdetails);

        return ResponseEntity.ok(new AuthenticationResponse(token, authenticationRequest.getUsername(), role, userId));

//      return ResponseEntity.ok(new AuthenticationResponse(token));
    }

    @PostMapping("/close-connection")
    public ResponseEntity<String> closeServerConnection(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("Server connection closed successfully.");
    }

    @RequestMapping(value = "/addUserMaster", method = RequestMethod.POST)
    public ResponseEntity<Map<String, String>> saveUser(@RequestBody UserDTO user) throws Exception {
        // Save and get the saved entity (with generated ID)
        DAOUser savedUser = userDetailsService.save(user);

        // Prepare the response
        Map<String, String> response = new HashMap<>();
        response.put("message", "User Save Successfully");
        response.put("id", String.valueOf(savedUser.getId())); // assuming getId() gives the generated ID

        return ResponseEntity.ok(response);
    }

    @PutMapping("/updateUserMaster/{id}")
    public ResponseEntity<ApiResponse> updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        Optional<DAOUser> userOpt = userRepository.findById(id);
        if (!userOpt.isPresent()) {
            ApiResponse response = new ApiResponse("User not found");
            return ResponseEntity.ok(response);
        }

        try {
            DAOUser user = userOpt.get();
            user.setFirstName(userDTO.getFirstName());
            user.setLastName(userDTO.getLastName());
            user.setUsername(userDTO.getUsername());
            user.setPassword(userDTO.getPassword());
            user.setPhoneNumber(userDTO.getPhoneNumber());
            user.setRole(userDTO.getRole());
            user.setEmail(userDTO.getEmail());
            user.setPetrol_nozzle(userDTO.getPetrol_nozzle());
            user.setDiesel_nozzle(userDTO.getDiesel_nozzle());
            user.setXp_petrol_nozzle(userDTO.getXp_petrol_nozzle());
            user.setPowe_diesel_nozzle(userDTO.getPowe_diesel_nozzle());

            userRepository.save(user);
            ApiResponse response = new ApiResponse("User updated successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse("Error updating user");
            return ResponseEntity.ok(response);
        }
    }

//    @RequestMapping(value = "/nozzleadd", method = RequestMethod.POST)
//    public ResponseEntity<ApiResponse> addPump(@RequestBody nozzleDetails nozzle) {
//        nozzleRepository.save(nozzle);
//        ApiResponse response = new ApiResponse("Nozzle Details Saved Successfully");
//        return  ResponseEntity.ok(response);
//    }
    @DeleteMapping("/deleteUser/{id}")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long id) {
        try {
            userRepository.deleteById(id);
            ApiResponse response = new ApiResponse("User deleted successfully");
            return ResponseEntity.ok(response);
        } catch (EmptyResultDataAccessException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping(value = "/allUser")
    public List<DAOUser> getAllData() {
        List<DAOUser> data = user.findAll();
        return data;
    }

    // PURCHASE SELL
    @GetMapping(value = "/purchasesList")
    public List<Purchase> getAllPayment(@RequestParam String userId) {
        List<Purchase> data = purchaseRepository.findByUserId(userId);
        return data;
    }

    @PostMapping("/addPurchase")
    public ResponseEntity<List<Purchase>> updatePurchase(@RequestBody List<Purchase> expenses) {
        List<Purchase> updatedExpenses = new ArrayList<>();

        for (Purchase expense : expenses) {
            Optional<Purchase> existingEntry = purchaseRepository.findByDateAndType(expense.getDate(), expense.getType());

            if (existingEntry.isPresent()) {
                Purchase existingExpense = existingEntry.get();

                // Perform arithmetic addition instead of string concatenation
                existingExpense.setQuantity(String.valueOf(Long.parseLong(existingExpense.getQuantity()) + Long.parseLong(expense.getQuantity())));
                existingExpense.setTotal(String.valueOf(Long.parseLong(existingExpense.getTotal()) + Long.parseLong(expense.getTotal())));
                existingExpense.setVat(String.valueOf(Long.parseLong(existingExpense.getVat()) + Long.parseLong(expense.getVat())));
                existingExpense.setCess(String.valueOf(Long.parseLong(existingExpense.getCess()) + Long.parseLong(expense.getCess())));
                existingExpense.setJtcpercentage(String.valueOf(Long.parseLong(existingExpense.getJtcpercentage()) + Long.parseLong(expense.getJtcpercentage())));
                existingExpense.setTotal_purchase(existingExpense.getTotal_purchase() + expense.getTotal_purchase());

                // Save the updated expense
                Purchase savedExpense = purchaseRepository.save(existingExpense);
                updatedExpenses.add(savedExpense);

            } else {
                // If it doesn't exist, it is saved as a new entry
                Purchase savedExpense = purchaseRepository.save(expense);
                updatedExpenses.add(savedExpense);
            }
        }
        return ResponseEntity.ok(updatedExpenses);
    }

    @PostMapping("/updatePurchase")
    public ResponseEntity<ApiResponse> updatePurchase(@RequestBody Purchase purchase) {
        purchaseRepository.save(purchase);
        ApiResponse response = new ApiResponse("Purchase updated and saved successfully");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/deletePurchase/{id}")
    public ResponseEntity<ApiResponse> deleteEntity(@PathVariable Integer id) {
        try {
            purchaseRepository.deleteById(id);
            ApiResponse response = new ApiResponse("Entity deleted successfully");
            return ResponseEntity.ok(response);
        } catch (EmptyResultDataAccessException ex) {
            return ResponseEntity.notFound().build(); // ID not found
        }
    }

    //PETROL SELL
    @GetMapping(value = "/petrolSellList")
    public List<PetrolSell> getAllPetrolSell(@RequestParam String userId) {
        List<PetrolSell> petrol = petrolSellRepository.findByUserId(userId);
        return petrol;
    }

    //   @PostMapping("/addPetrolsell")
//public ResponseEntity<List<PetrolSell>> updatePetrolsell(@RequestBody List<PetrolSell> petrolSellList) {
//    List<PetrolSell> updatedPetrolSells = new ArrayList<>();
//
//    for (PetrolSell petrolSell : petrolSellList) {
//        // Check if the entry with the same date and pump exists
//        Optional<PetrolSell> existingEntry = petrolSellRepository.findByDateAndPump(petrolSell.getDate(), petrolSell.getPump());
//
//        if (existingEntry.isPresent()) {
//            // Update existing entry if needed
//            PetrolSell existingPetrolSell = existingEntry.get();
//            existingPetrolSell.setUserId(petrolSell.getUserId());
//            existingPetrolSell.setClose_meter(petrolSell.getClose_meter());
//            existingPetrolSell.setOpen_meter(petrolSell.getOpen_meter());
//            existingPetrolSell.setTotal(petrolSell.getTotal());
//            existingPetrolSell.setTesting(petrolSell.getTesting());
//            existingPetrolSell.setPetrol_ltr(petrolSell.getPetrol_ltr());
//            existingPetrolSell.setRate(petrolSell.getRate());
//            existingPetrolSell.setTotal_sell(petrolSell.getTotal_sell());
//
//            PetrolSell updatedPetrolSell = petrolSellRepository.save(existingPetrolSell);
//            updatedPetrolSells.add(updatedPetrolSell);
//            System.out.println("Updated existing entry: " + updatedPetrolSell);
//        } else {
//            // Save new entry if it doesn't exist
//            PetrolSell newPetrolSell = petrolSellRepository.save(petrolSell);
//            updatedPetrolSells.add(newPetrolSell);
//            System.out.println("Saved new entry: " + newPetrolSell);
//        }
//    }
//
//    return ResponseEntity.ok(updatedPetrolSells);
//}
    @PostMapping("/addPetrolsell")
    public ResponseEntity<List<PetrolSell>> addPetrolSell(@RequestBody PetrolSell request) {
        List<PetrolSell> updatedPetrolSells = new ArrayList<>();

        for (PetrolSell petrolSell : request.getRows()) {
            // Set the userId and date from the request object
            petrolSell.setUserId(request.getUserId());
            petrolSell.setDate(request.getDate());

            // Check for existing entry by date and pump
            Optional<PetrolSell> existingEntry = petrolSellRepository.findByDateAndPump(petrolSell.getDate(), petrolSell.getPump());

            if (existingEntry.isPresent()) {
                PetrolSell existingPetrolSell = existingEntry.get();
                existingPetrolSell.setClose_meter(petrolSell.getClose_meter());
                existingPetrolSell.setOpen_meter(petrolSell.getOpen_meter());
                existingPetrolSell.setTotal(petrolSell.getTotal());
                existingPetrolSell.setTesting(petrolSell.getTesting());
                existingPetrolSell.setPetrol_ltr(petrolSell.getPetrol_ltr());
                existingPetrolSell.setRate(petrolSell.getRate());
                existingPetrolSell.setTotal_sell(petrolSell.getTotal_sell());

                // Save the updated entry
                PetrolSell updatedPetrolSell = petrolSellRepository.save(existingPetrolSell);
                updatedPetrolSells.add(updatedPetrolSell);
            } else {
                // Save new entry
                PetrolSell newPetrolSell = petrolSellRepository.save(petrolSell);
                updatedPetrolSells.add(newPetrolSell);
            }
        }

        return ResponseEntity.ok(updatedPetrolSells);
    }

    @PostMapping("/updatePetrolsell")
    public ResponseEntity<ApiResponse> updatePetrolsell(@RequestBody PetrolSell petrolSell) {
        petrolSellRepository.save(petrolSell);
        ApiResponse response = new ApiResponse("PetrolSell updated and saved successfully");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/deletePetrol/{id}")
    public ResponseEntity<ApiResponse> deletePetroldata(@PathVariable Integer id) {
        try {
            petrolSellRepository.deleteById(id);
            ApiResponse response = new ApiResponse("Petrol deleted successfully");
            return ResponseEntity.ok(response);
        } catch (EmptyResultDataAccessException ex) {
            return ResponseEntity.notFound().build(); // ID not found
        }
    }

    //    DIESEL_SELL
    @GetMapping(value = "/dieselSellList")
    public List<Dieselsell> getAllDieselSell(@RequestParam String userId) {
        List<Dieselsell> Diesel = dieselSellRepository.findByUserId(userId);
        return Diesel;
    }
//    @PostMapping("/addDieselSell")
//    public Dieselsell SetDieselSell(@RequestBody Dieselsell add) {
//        System.out.println(add.toString());
//        dieselSellRepository.save(add);
//        return add;
//    }

    @PostMapping("/addDieselSell")
    public ResponseEntity<List<Dieselsell>> addDieselSell(@RequestBody Dieselsell request) {
        List<Dieselsell> updatedDieselSells = new ArrayList<>();

        for (Dieselsell dieselsell : request.getRows()) {
            // Set the userId and date from the request object
            dieselsell.setUserId(request.getUserId());
            dieselsell.setDate(request.getDate());

            // Check for existing entry by date and pump
            Optional<Dieselsell> existingEntry = dieselSellRepository.findByDateAndPump(dieselsell.getDate(), dieselsell.getPump());

            if (existingEntry.isPresent()) {
                // Update existing entry
                Dieselsell existingDieselSell = existingEntry.get();
                existingDieselSell.setClose_meter(dieselsell.getClose_meter());
                existingDieselSell.setOpen_meter(dieselsell.getOpen_meter());
                existingDieselSell.setTotal(dieselsell.getTotal());
                existingDieselSell.setTesting(dieselsell.getTesting());
                existingDieselSell.setDiesel_ltr(dieselsell.getDiesel_ltr());
                existingDieselSell.setRate(dieselsell.getRate());
                existingDieselSell.setTotal_sell(dieselsell.getTotal_sell());

                // Save the updated entry
                Dieselsell updatedDieselSell = dieselSellRepository.save(existingDieselSell);
                updatedDieselSells.add(updatedDieselSell);
            } else {
                // Save new entry
                Dieselsell newDieselSell = dieselSellRepository.save(dieselsell);
                updatedDieselSells.add(newDieselSell);
            }
        }

        return ResponseEntity.ok(updatedDieselSells);
    }

    @PostMapping("/updateDieselsell")
    public ResponseEntity<ApiResponse> Updatedieselsell(@RequestBody Dieselsell dieselsell) {
        dieselSellRepository.save(dieselsell);
        ApiResponse response = new ApiResponse("Dieselsell updated and saved successfully");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/deleteDiesel/{id}")
    public ResponseEntity<ApiResponse> deleteDieseldata(@PathVariable Integer id) {
        try {
            dieselSellRepository.deleteById(id);
            ApiResponse response = new ApiResponse("Dieselsell deleted successfully");
            return ResponseEntity.ok(response);
        } catch (EmptyResultDataAccessException ex) {
            return ResponseEntity.notFound().build(); // ID not found
        }
    }

    //xpPetrol
    @GetMapping(value = "/XPPetrolsellList")
    public List<xpPetrol> getAllXPPetrol(@RequestParam String userId) {
        List<xpPetrol> xpPetrol = xpPetorlRepository.findByUserId(userId);
        return xpPetrol;
    }

    @PostMapping("/addXPPetrolsell")
    public ResponseEntity<List<xpPetrol>> addXpPetrolSell(@RequestBody xpPetrol xp) {
        List<xpPetrol> updatedXpPetrolSells = new ArrayList<>();

        for (xpPetrol xpPetrol : xp.getRows()) {
            // Set the userId and date from the request object
            xpPetrol.setUserId(xp.getUserId());
            xpPetrol.setDate(xp.getDate());

            // Check for existing entry by date and pump
            Optional<xpPetrol> existingEntry = xpPetorlRepository.findByDateAndPump(xpPetrol.getDate(), xpPetrol.getPump());

            if (existingEntry.isPresent()) {
                xpPetrol existingPetrolSell = existingEntry.get();
                existingPetrolSell.setClose_meter(xpPetrol.getClose_meter());
                existingPetrolSell.setOpen_meter(xpPetrol.getOpen_meter());
                existingPetrolSell.setTotal(xpPetrol.getTotal());
                existingPetrolSell.setTesting(xpPetrol.getTesting());
                existingPetrolSell.setXppetrol_ltr(xpPetrol.getXppetrol_ltr());
                existingPetrolSell.setRate(xpPetrol.getRate());
                existingPetrolSell.setTotal_sell(xpPetrol.getTotal_sell());

                // Save the updated entry
                xpPetrol updatedxpPetrol = xpPetorlRepository.save(existingPetrolSell);
                updatedXpPetrolSells.add(updatedxpPetrol);
            } else {
                // Save new entry
                xpPetrol newXpPetrolSell = xpPetorlRepository.save(xpPetrol);
                updatedXpPetrolSells.add(newXpPetrolSell);
            }
        }

        return ResponseEntity.ok(updatedXpPetrolSells);
    }

    @PostMapping("/updateXpPetrolsell")
    public ResponseEntity<ApiResponse> updateXPPetrolsell(@RequestBody xpPetrol xpPetrol) {
        xpPetorlRepository.save(xpPetrol);
        ApiResponse response = new ApiResponse("XPPetrol updated and saved successfully");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/deletexpPetrol/{id}")
    public ResponseEntity<ApiResponse> deletexpPetroldata(@PathVariable Integer id) {
        try {
            xpPetorlRepository.deleteById(id);
            ApiResponse response = new ApiResponse("XPPetrol deleted successfully");
            return ResponseEntity.ok(response);
        } catch (EmptyResultDataAccessException ex) {
            return ResponseEntity.notFound().build(); // ID not found
        }
    }

    //PowerDiesel
    @GetMapping(value = "/powerDieselList")
    public List<powerDiesel> getAllPowerDiesel(@RequestParam String userId) {
        List<powerDiesel> powerDiesel = powerDieselRepository.findByUserId(userId);
        return powerDiesel;
    }

    @PostMapping("/addpowerDiesel")
    public ResponseEntity<List<powerDiesel>> addpowerDiesel(@RequestBody powerDiesel pw) {
        List<powerDiesel> updatedpowerDiesel = new ArrayList<>();

        for (powerDiesel powerDiesel : pw.getRows()) {
            // Set the userId and date from the request object
            powerDiesel.setUserId(pw.getUserId());
            powerDiesel.setDate(pw.getDate());

            // Check for existing entry by date and pump
            Optional<powerDiesel> existingEntry = powerDieselRepository.findByDateAndPump(powerDiesel.getDate(), powerDiesel.getPump());

            if (existingEntry.isPresent()) {
                powerDiesel existingPowerDiesel = existingEntry.get();
                existingPowerDiesel.setClose_meter(powerDiesel.getClose_meter());
                existingPowerDiesel.setOpen_meter(powerDiesel.getOpen_meter());
                existingPowerDiesel.setTotal(powerDiesel.getTotal());
                existingPowerDiesel.setTesting(powerDiesel.getTesting());
                existingPowerDiesel.setPowerdiesel_ltr(powerDiesel.getPowerdiesel_ltr());
                existingPowerDiesel.setRate(powerDiesel.getRate());
                existingPowerDiesel.setTotal_sell(powerDiesel.getTotal_sell());

                // Save the updated entry
                powerDiesel updatedpowerdiesel = powerDieselRepository.save(existingPowerDiesel);
                updatedpowerDiesel.add(updatedpowerdiesel);
            } else {
                // Save new entry
                powerDiesel newpowerDiesel = powerDieselRepository.save(powerDiesel);
                updatedpowerDiesel.add(newpowerDiesel);
            }
        }

        return ResponseEntity.ok(updatedpowerDiesel);
    }

    @PostMapping("/updatepowerDiesel")
    public ResponseEntity<ApiResponse> updatepowerDiesel(@RequestBody powerDiesel powerDiesel) {
        powerDieselRepository.save(powerDiesel);
        ApiResponse response = new ApiResponse("PowerDiesel updated and saved successfully");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/deletepowerDiesel/{id}")
    public ResponseEntity<ApiResponse> deletepowerDiesel(@PathVariable Integer id) {
        try {
            powerDieselRepository.deleteById(id);
            ApiResponse response = new ApiResponse("PowerDiesel deleted successfully");
            return ResponseEntity.ok(response);
        } catch (EmptyResultDataAccessException ex) {
            return ResponseEntity.notFound().build(); // ID not found
        }
    }

    //    OILSELL
    @GetMapping(value = "/oilSellList")
    public List<OilSell> getAllOilSell(@RequestParam String userId) {
//        List<OilSell> oil = oilSellRepository.findAll();
        List<OilSell> oil = oilSellRepository.findByUserId(userId);
        return oil;
    }

    @PostMapping("/addOilsell")
    public void receiveOilsell(@RequestBody List<OilSell> expenses) {
        for (OilSell expense : expenses) {
            expense.setUserId(expense.getUserId());
            expense.setDate(expense.getDate()); // Set the date
            expense.setValue(expense.getValue()); // Set the notes
            expense.setPrice(expense.getPrice());
            System.out.println(expense);
            oilSellRepository.save(expense);
        }
    }

    @DeleteMapping("/deleteOilSell/{id}")
    public ResponseEntity<ApiResponse> deleteoildata(@PathVariable Integer id) {
        try {
            oilSellRepository.deleteById(id);
            ApiResponse response = new ApiResponse("Oilsell deleted successfully");
            return ResponseEntity.ok(response);
        } catch (EmptyResultDataAccessException ex) {
            return ResponseEntity.notFound().build(); // ID not found
        }
    }

    //    PETROL/DIESEL DIP
    @GetMapping(value = "/dipPDStockList")
    public List<DipStock> getAllDipstock(@RequestParam String userId) {
        List<DipStock> dip = dipStockRepository.findByUserId(userId);
        return dip;
    }

    @GetMapping(value = "/dipvalueMainTable")
    public List<Dipvalue> getdipvalue() {
        List<Dipvalue> customer = dipvalueRepository.findAll();
        return customer;
    }

    @PostMapping("/addPDDipsell")
    public ResponseEntity<ApiResponse> addDipsell(@RequestBody DipStock dipStock) {
        dipStockRepository.save(dipStock);
        ApiResponse response = new ApiResponse("Dip updated and saved successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/editPDDipsell")
    public ResponseEntity<ApiResponse> updateDipsell(@RequestBody DipStock dipStock) {
        Optional<DipStock> existingDipStock = dipStockRepository.findByDate(dipStock.getDate());

        if (existingDipStock.isPresent()) {
            DipStock updatedDipStock = existingDipStock.get();
            updatedDipStock.setPetroldip(dipStock.getPetroldip());
            updatedDipStock.setPvalue(dipStock.getPvalue());
            updatedDipStock.setDieseldip(dipStock.getDieseldip());
            updatedDipStock.setDvalue(dipStock.getDvalue());
            dipStockRepository.save(updatedDipStock);
            return ResponseEntity.ok(new ApiResponse("Dip updated and saved successfully."));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("No record found for the provided date."));
        }
    }

    @DeleteMapping("/deleteDip/{id}")
    public ResponseEntity<ApiResponse> deleteDipdata(@PathVariable Integer id) {
        try {
            dipStockRepository.deleteById(id);
            ApiResponse response = new ApiResponse("DipSell deleted successfully");
            return ResponseEntity.ok(response);
        } catch (EmptyResultDataAccessException ex) {
            return ResponseEntity.notFound().build(); // ID not found
        }
    }


    //   Extra PETROL/DIESEL DIP
      @GetMapping("/extradip/{id}")
    public Double getExtradipById(@PathVariable("id") Integer id) {
        // Fetch volume by id using the repository method
        Double extra = extraDipvalueRepository.findVolumeById(id);
        return extra;
    }

    @GetMapping(value = "/extradipPDStockList")
    public List<extraDipStock> getAllextraDipstock(@RequestParam String userId) {
        List<extraDipStock> extraDipdip = extraDipStockRepository.findByUserId(userId);
        return extraDipdip;
    }

    @GetMapping(value = "/extradipvalueMainTable")
    public List<extraDipvalue> getextradipvalue() {
        List<extraDipvalue> extraDipvalue = extraDipvalueRepository.findAll();
        return extraDipvalue;
    }

    @PostMapping("/addextraPDDipsell")
    public ResponseEntity<ApiResponse> addextraDipsell(@RequestBody extraDipStock extradipStock) {
        extraDipStockRepository.save(extradipStock);
        ApiResponse response = new ApiResponse("ExtraDip updated and saved successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/editExtraPDDipsell")
    public ResponseEntity<ApiResponse> updateExtraDipsell(@RequestBody extraDipStock extraDipStock) {
        Optional<extraDipStock> existingextraDipStock = extraDipStockRepository.findByDate(extraDipStock.getDate());


        if (existingextraDipStock.isPresent()) {
            extraDipStock updatedextraDipStock = existingextraDipStock.get();
            updatedextraDipStock.setExtra_petroldip(extraDipStock.getExtra_petroldip());
            updatedextraDipStock.setExtra_pvalue(extraDipStock.getExtra_pvalue());
            updatedextraDipStock.setExtra_dieseldip(extraDipStock.getExtra_dieseldip());
            updatedextraDipStock.setExtra_dvalue(extraDipStock.getExtra_dvalue());
            extraDipStockRepository.save(updatedextraDipStock);
            return ResponseEntity.ok(new ApiResponse("Extra_Dip updated and saved successfully."));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("No record found for the provided date."));
        }
    }

    @DeleteMapping("/deleteExtraDip/{id}")
    public ResponseEntity<ApiResponse> deleteExtraDipdata(@PathVariable Integer id) {
        try {
            extraDipStockRepository.deleteById(id);
            ApiResponse response = new ApiResponse("Extra_DipSell deleted successfully");
            return ResponseEntity.ok(response);
        } catch (EmptyResultDataAccessException ex) {
            return ResponseEntity.notFound().build(); // ID not found
        }
    }

    //KHARCH SELL
    @GetMapping(value = "/kharchSellList")
    public List<kharch> getAllkharch(@RequestParam String userId) {
        List<kharch> oil = kharchrepository.findByUserId(userId);
        return oil;
    }

    @PostMapping("/addkharch")
    public void receiveExpenses(@RequestBody List<kharch> expenses) {
        for (kharch expense : expenses) {
            expense.setUserId(expense.getUserId());
            expense.setDate(expense.getDate()); // Set the date
            expense.setNotes(expense.getNotes()); // Set the notes
            expense.setPrice(expense.getPrice());
            System.out.println(expense);
            kharchrepository.save(expense);
        }
    }

    @DeleteMapping("/deleteKharch/{id}")
    public ResponseEntity<ApiResponse> deletekharchdata(@PathVariable Integer id) {
        try {
            kharchrepository.deleteById(id);
            ApiResponse response = new ApiResponse("KharchSell deleted successfully");
            return ResponseEntity.ok(response);
        } catch (EmptyResultDataAccessException ex) {
            return ResponseEntity.notFound().build(); // ID not found
        }
    }

    //ATM SELL
    @GetMapping(value = "/atmSellList")
    public List<transaction> getalltransaction(@RequestParam String userId) {
        List<transaction> transaction = transactionRepository.findByUserId(userId);
        return transaction;
    }

    @PostMapping("/addAtmSell")
    public void receivetransaction(@RequestBody List<transaction> expenses) {
        for (transaction expense : expenses) {
            expense.setUserId(expense.getUserId());
            expense.setDate(expense.getDate()); // Set the date
            expense.setName(expense.getName()); // Set the notes
            expense.setAmount(expense.getAmount());
            expense.setTransaction(expense.getTransaction());
            System.out.println(expense);
            transactionRepository.save(expense);
        }
    }

    @DeleteMapping("/deleteAtm/{id}")
    public ResponseEntity<ApiResponse> deletetransaction(@PathVariable Integer id) {
        try {
            transactionRepository.deleteById(id);
            ApiResponse response = new ApiResponse("Transaction deleted successfully");
            return ResponseEntity.ok(response);
        } catch (EmptyResultDataAccessException ex) {
            return ResponseEntity.notFound().build(); // ID not found
        }
    }

    //JAMA&BAKI SELL
    @GetMapping(value = "/jamaBakiList")
    public List<jamabaki> getJamaBakilist(@RequestParam String userId) {
        List<jamabaki> jamabaki = JamabakiRepository.findByUserId(userId);
        return jamabaki;
    }

    @PostMapping("/addJamabakiSell")
    public void receivejamabakiadd(@RequestBody List<jamabaki> expenses) {
        for (jamabaki expense : expenses) {
            expense.setUserId(expense.getUserId());
            expense.setDate(expense.getDate()); // Set the date
            expense.setName(expense.getName()); // Set the notes
            expense.setJama(expense.getJama());
            expense.setBaki(expense.getBaki());
            System.out.println(expense.toString());
            JamabakiRepository.save(expense);
        }
    }

    @PutMapping("/updateJamaBakiSell")
    public ResponseEntity<?> updateData(@RequestBody jamabaki data) {
        try {
            jamabaki updatedData = JamabakiRepository.save(data); // Assuming save method updates if the entity exists
            return ResponseEntity.ok(updatedData);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating data: " + e.getMessage());
        }
    }

    @DeleteMapping("/deleteJamaBaki/{id}")
    public ResponseEntity<ApiResponse> deletejamaBakidata(@PathVariable Integer id) {
        try {
            JamabakiRepository.deleteById(id);
            ApiResponse response = new ApiResponse("JamaBaki deleted successfully");
            return ResponseEntity.ok(response);
        } catch (EmptyResultDataAccessException ex) {
            return ResponseEntity.notFound().build(); // ID not found
        }
    }

    // Show Report
//    @GetMapping(value = "/bill", produces = MediaType.APPLICATION_PDF_VALUE)
//    public ResponseEntity<byte[]> getBill(@RequestParam("date")
//            @DateTimeFormat(pattern = "yyyy-MM-dd") String date) throws IOException, JRException, java.text.ParseException {
//        Pageable limit = PageRequest.of(0, 4);
//        List<Object[]> data = purchaseRepository.getDataForDate(date); // Fetch data based on the provided date
//
//        List<Object[]> puchaseData = purchaseRepository.getPurchaseDataOnDate(date);
//        List<Object[]> oilData = oilSellRepository.getoilDataOnDate(date);
//        byte[] reportBytes = generateReport(data, puchaseData, oilData, date); // Pass fetched data to the generateReport method
//        return ResponseEntity.ok().contentType(MediaType.APPLICATION_PDF).body(reportBytes);
//    }
    @GetMapping(value = "/report", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> getReport(@RequestParam String date, @RequestParam String time, @RequestParam String userId)
            throws IOException, JRException, java.text.ParseException {
        Long userIdLong = Long.valueOf(userId);
        String name = userRepository.getUserDataForDate(userIdLong);
        List<Object[]> data = purchaseRepository.getDataForDate(date, userId);
        List<Object[]> purchaseData = purchaseRepository.getPurchaseDataOnDate(date, userId);
        List<Object[]> petrolData = petrolSellRepository.getPetrolDataOnDate(date, userId);
        List<Object[]> dieselData = dieselSellRepository.getDieselDataOnDate(date, userId);
        List<Object[]> oilData = oilSellRepository.getoilDataOnDate(date, userId);
        List<Object[]> dip = dipStockRepository.getDipDataOnDate(date, userId);
        List<Object[]> transaction = transactionRepository.gettransationDataOnDate(date, userId);
        List<Object[]> jamabaki = JamabakiRepository.getjamaBakiDataOnDate(date, userId);

        byte[] reportBytes = generateReport(name, date, time, userId, petrolData, dieselData,
                data, purchaseData, oilData, dip, transaction, jamabaki);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .body(reportBytes);
    }

    private byte[] generateReport(String name, String date, String time, String userId,
            List<Object[]> petrol, List<Object[]> diesel, List<Object[]> data,
            List<Object[]> purchaseData, List<Object[]> oilData, List<Object[]> dip,
            List<Object[]> transaction, List<Object[]> jamabaki) throws IOException, JRException, java.text.ParseException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        JasperReport jasperReport = (JasperReport) JRLoader.loadObjectFromFile("D:/report3.jasper");
        HashMap<String, Object> parameters = new HashMap<>();
        parameters.put("PUMP_NAME", name);
        parameters.put("REPORTDATE", date);
        parameters.put("TIME", time);

        //RATE
        parameters.put("PPRATE", petrol.get(0)[4]);
        parameters.put("DDRATE", diesel.get(0)[4]);

        //PETROL
        double totalRsSum = 0.0;
        double totalLtrSum = 0.0;
        int start = 0;
        int end = 5;

        for (int i = start; i <= end && i < petrol.size(); i++) {
            parameters.put("PP" + (i + 1) + "OM", petrol.get(i)[0] != null ? petrol.get(i)[0] : "-");
            parameters.put("PP" + (i + 1) + "CM", petrol.get(i)[1] != null ? petrol.get(i)[1] : "-");
            parameters.put("PP" + (i + 1) + "SL", petrol.get(i)[2] != null ? petrol.get(i)[2] : "-");
            parameters.put("PP" + (i + 1) + "TEST", petrol.get(i)[5] != null ? petrol.get(i)[5] : "-");
            parameters.put("PP" + (i + 1) + "LTR", petrol.get(i)[6] != null ? petrol.get(i)[6] : "-");
            parameters.put("PP" + (i + 1) + "TOTALRS", petrol.get(i)[7] != null ? petrol.get(i)[7] : "-");

            // Add values to the sums (if not null, parse them to double)
            if (petrol.get(i)[7] != null) {
                totalRsSum += Double.parseDouble((String) petrol.get(i)[7]);
            }
            if (petrol.get(i)[6] != null) {
                totalLtrSum += Double.parseDouble((String) petrol.get(i)[6]);
            }
        }

        start = 2; // Adjust start index
        end = 3;   // Adjust end index

        List<String> multiList = new ArrayList<>();
        for (int i = start; i <= end && i < petrol.size(); i++) {
            multiList.add("PP" + (i + 1) + "OM: " + (petrol.get(i)[0] != null ? petrol.get(i)[0] : "-"));
            multiList.add("PP" + (i + 1) + "CM: " + (petrol.get(i)[1] != null ? petrol.get(i)[1] : "-"));
            multiList.add("PP" + (i + 1) + "SL: " + (petrol.get(i)[2] != null ? petrol.get(i)[2] : "-"));
            multiList.add("PP" + (i + 1) + "TEST: " + (petrol.get(i)[5] != null ? petrol.get(i)[5] : "-"));
            multiList.add("PP" + (i + 1) + "LTR: " + (petrol.get(i)[6] != null ? petrol.get(i)[6] : "-"));
            multiList.add("PP" + (i + 1) + "TOTALRS: " + (petrol.get(i)[7] != null ? petrol.get(i)[7] : "-"));

            // Add values to the sums for later calculation
            if (petrol.get(i)[7] != null) {
                totalRsSum += Double.parseDouble((String) petrol.get(i)[7]);
            }
            if (petrol.get(i)[6] != null) {
                totalLtrSum += Double.parseDouble((String) petrol.get(i)[6]);
            }
        }

        parameters.put("PTOTAL", String.valueOf(totalRsSum));
        parameters.put("PTOTALLTR", String.valueOf(totalLtrSum));

        double dieseltotalLtrSum = 0.0;
        double dieseltotalRsSum = 0.0;
        int startd = 0;
        int endd = 4;

        for (int i = startd; i <= endd && i < diesel.size(); i++) {
            parameters.put("DP" + (i + 1) + "OM", diesel.get(i)[0] != null ? diesel.get(i)[0] : "-");
            parameters.put("DP" + (i + 1) + "CM", diesel.get(i)[1] != null ? diesel.get(i)[1] : "-");
            parameters.put("DP" + (i + 1) + "SL", diesel.get(i)[2] != null ? diesel.get(i)[2] : "-");
            parameters.put("DP" + (i + 1) + "TEST", diesel.get(i)[5] != null ? diesel.get(i)[5] : "-");
            parameters.put("DP" + (i + 1) + "LTR", diesel.get(i)[6] != null ? diesel.get(i)[6] : "-");
            parameters.put("DP" + (i + 1) + "TOTALRS", diesel.get(i)[7] != null ? diesel.get(i)[7] : "-");

            // Accumulate sum for LTR and TOTALRS
            if (diesel.get(i)[6] != null) {
                dieseltotalLtrSum += Double.parseDouble((String) diesel.get(i)[6]);
            }
            if (diesel.get(i)[7] != null) {
                dieseltotalRsSum += Double.parseDouble((String) diesel.get(i)[7]);
            }
        }

        // Adjust the range dynamically for the second list (indices 2 and 3)
        startd = 2;
        endd = 3;

        List<String> multiListdiesel = new ArrayList<>();
        for (int i = startd; i <= endd && i < diesel.size(); i++) {
            multiListdiesel.add("DP" + (i + 1) + "OM: " + (diesel.get(i)[0] != null ? diesel.get(i)[0] : "-"));
            multiListdiesel.add("DP" + (i + 1) + "CM: " + (diesel.get(i)[1] != null ? diesel.get(i)[1] : "-"));
            multiListdiesel.add("DP" + (i + 1) + "SL: " + (diesel.get(i)[2] != null ? diesel.get(i)[2] : "-"));
            multiListdiesel.add("DP" + (i + 1) + "TEST: " + (diesel.get(i)[5] != null ? diesel.get(i)[5] : "-"));
            multiListdiesel.add("DP" + (i + 1) + "LTR: " + (diesel.get(i)[6] != null ? diesel.get(i)[6] : "-"));
            multiListdiesel.add("DP" + (i + 1) + "TOTALRS: " + (diesel.get(i)[7] != null ? diesel.get(i)[7] : "-"));

            // Accumulate sum for LTR and TOTALRS
            if (diesel.get(i)[6] != null) {
                dieseltotalLtrSum += Double.parseDouble((String) diesel.get(i)[6]);
            }
            if (diesel.get(i)[7] != null) {
                dieseltotalRsSum += Double.parseDouble((String) diesel.get(i)[7]);
            }
        }
//        parameters.put("DTOTALLTR", dieseltotalLtrSum);
//        parameters.put("DTOTAL", dieseltotalRsSum);
//        parameters.put("MultiListData",String.valueOf(multiListdiesel));

        parameters.put("DTOTALLTR", String.valueOf(dieseltotalLtrSum));
        parameters.put("DTOTAL", String.valueOf(dieseltotalRsSum));

        double totalfule = totalRsSum + dieseltotalRsSum;
        List<Double> sumDatajama = JamabakiRepository.findJamaSumByDate(date, userId);
        List<Double> sumDatabaki = JamabakiRepository.findBakiSumByDate(date, userId);
        List<Double> sumoilSell = oilSellRepository.findOilsellSumByDate(date, userId);
        List<Double> sumKharch = kharchrepository.findKharchSumByDate(date, userId);
        List<Double> sumATM = transactionRepository.findAtmSumByDate(date, userId);

        parameters.put("BILL_BAKI_RS", String.valueOf(safeSum(sumDatabaki)));
        parameters.put("TOTAL_FULE_RS", String.valueOf(totalfule));
        parameters.put("LUBE_OIL_RS", String.valueOf(safeSum(sumoilSell)));
        parameters.put("ATM_WALLET", String.valueOf(safeSum(sumATM)));
        parameters.put("INDIRECT_EXPENSES", String.valueOf(safeSum(sumKharch)));
        parameters.put("BILL_JAMA_RS", String.valueOf(safeSum(sumDatajama)));
        parameters.put("P_PURCHASE_LTR", purchaseData.size() > 0 && purchaseData.get(0) != null ? String.valueOf(purchaseData.get(0)) : "0");
        parameters.put("D_PURCHASE_LTR", purchaseData.size() > 1 && purchaseData.get(1) != null ? String.valueOf(purchaseData.get(1)) : "0");
//        parameters.put("BILL_BAKI_RS", sumDatabaki);
//        parameters.put("TOTAL_FULE_RS", totalfule);
//        parameters.put("LUBE_OIL_RS", sumoilSell);
//        parameters.put("ATM_WALLET", sumATM);
//        parameters.put("INDIRECT_EXPENSES", sumKharch);
//        parameters.put("BILL_JAMA_RS", sumDatajama);
//        parameters.put("P_PURCHASE_LTR", purchaseData.get(0));
//        parameters.put("D_PURCHASE_LTR", purchaseData.get(1));
//        parameters.put("P_PURCHASE_LTR", purchaseData.size() > 0 && purchaseData.get(0) != null ? purchaseData.get(0) : 0);
//        parameters.put("D_PURCHASE_LTR", purchaseData.size() > 1 && purchaseData.get(1) != null ? purchaseData.get(1) : 0);

        double totalSum = 0.0;
        double finalTotal
                = safeSum(sumDatajama)
                + safeSum(sumoilSell)
                + totalfule
                - safeSum(sumATM)
                - safeSum(sumDatabaki)
                - safeSum(sumKharch);

        parameters.put("TOTAL_CASE_RS", String.valueOf(finalTotal));

        List<dailytotal> existingRecords = DailytotalRepository.findByDateAndUserId(date, userId);
        if (existingRecords.isEmpty()) {
            dailytotal dailyTotal = new dailytotal();
            dailyTotal.setDate(date);
            dailyTotal.setDailyTotal(finalTotal);
            dailyTotal.setUserId(userId);
            DailytotalRepository.save(dailyTotal);
        } else {
            System.out.println("Data for date " + date + " already exists. Skipping save operation.");
        }

        // parameters.put("DIESEL_UGADTOSTOCK", dataForOneDayAgodiesel.get(0).getDieselopenstock());
        List<Dailystock> dataForOneDayAgo = dailyskockRepository.findDataForOneDayAgo(date, userId);
        List<dailydieselstock> dataForOneDayAgodiesel = dailydieselstockRepository.findDataForOneDayAgo(date, userId);
        parameters.put("PETROL_UGADTOSTOCK", String.valueOf(dataForOneDayAgo.get(0).getOpenstock()));
        parameters.put("DIESEL_UGADTOSTOCK", String.valueOf(dataForOneDayAgodiesel.get(0).getDieselopenstock()));
        parameters.put("P_PURCHASE_LTR", (purchaseData.size() > 0 && purchaseData.get(0) != null) ? String.valueOf(purchaseData.get(0)) : "0");
        parameters.put("D_PURCHASE_LTR", (purchaseData.size() > 1 && purchaseData.get(1) != null) ? String.valueOf(purchaseData.get(1)) : "0");
        parameters.put("PETROL_PURCHASELTR", (purchaseData.size() > 0 && purchaseData.get(0) != null) ? String.valueOf(purchaseData.get(0)) : "0");
        parameters.put("DIESEL_PURCHASELTR", (purchaseData.size() > 1 && purchaseData.get(1) != null) ? String.valueOf(purchaseData.get(1)) : "0");

//        Object petrolPurchaseData = purchaseData.get(0);  // Directly get the object
//        Object petrolPurchaseData = !purchaseData.isEmpty() && purchaseData.get(0) != null ? purchaseData.get(0) : 0;
        Object petrolPurchaseData;
        try {
            petrolPurchaseData = (purchaseData.get(0) != null) ? purchaseData.get(0) : 0;
        } catch (IndexOutOfBoundsException e) {
            petrolPurchaseData = 0;
        }

        double petrolPurchase = 0.0;
        if (petrolPurchaseData != null) {
            if (petrolPurchaseData instanceof String) {
                try {
                    petrolPurchase = Double.parseDouble((String) petrolPurchaseData);
                } catch (NumberFormatException e) {
                    System.out.println("Invalid value in purchaseData for petrol: " + petrolPurchaseData);
                }
            } else if (petrolPurchaseData instanceof Number) {
                petrolPurchase = ((Number) petrolPurchaseData).doubleValue();
            } else {
                System.out.println("Invalid type in purchaseData for petrol.");
            }
        }
        double petrolOpenStock = dataForOneDayAgo.get(0).getOpenstock();
        double petrolSum = petrolOpenStock + petrolPurchase;

//      Object dieselPurchaseData = purchaseData.get(1);
        Object dieselPurchaseData = (purchaseData.size() > 0 && purchaseData.get(0) != null) ? purchaseData.get(1) : 0;

        double dieselPurchase = 0.0;
        if (dieselPurchaseData != null) {
            if (dieselPurchaseData instanceof String) {
                try {
                    dieselPurchase = Double.parseDouble((String) dieselPurchaseData);
                } catch (NumberFormatException e) {
                    System.out.println("Invalid value in purchaseData for diesel: " + dieselPurchaseData);
                }
            } else if (dieselPurchaseData instanceof Number) {
                dieselPurchase = ((Number) dieselPurchaseData).doubleValue();
            } else {
                System.out.println("Invalid type in purchaseData for diesel.");
            }
        }
        double dieselOpenStock = dataForOneDayAgodiesel.get(0).getDieselopenstock();
        double dieselSum = dieselOpenStock + dieselPurchase;
        parameters.put("PETROL_TOTALSTOCKLTR", String.valueOf(petrolSum));
        parameters.put("DIESEL_TOTALSTOCKLTR", String.valueOf(dieselSum));
        parameters.put("PETROL_TOTALSALELTR", String.valueOf(totalLtrSum));
        parameters.put("DIESEL_TOTALSALELTR", String.valueOf(dieseltotalLtrSum));
        double minP = petrolSum - totalLtrSum;
        double minD = dieselSum - dieseltotalLtrSum;
        parameters.put("PETROL_GRANDTOTAL", String.valueOf(minP));
        parameters.put("DIESEL_GRANDTOTAL", String.valueOf(minD));
        //
        parameters.put("DIESEL_DIP", dip.get(0)[0]);
        parameters.put("PETRO_DIP", dip.get(0)[1]);
//        parameters.put("DIP_PETROL_LTR",);
//        parameters.put("DIP_DIESEL_LTR",);
//        parameters.put("PETRO_PLUS_MIN",);
//        parameters.put("DIP_DIESEL_LTR",);
        if (dailyskockRepository.countByDate(date, userId) == 0) {
            dailyskockRepository.insertDailyStock(date, minP, userId);
        } else {
            System.out.println("Daily petrol stock for date " + date + " already exists. Skipping save operation.");
        }
        if (dailydieselstockRepository.countByDate(date, userId) == 0) {
            dailydieselstockRepository.insertDailydieselstock(date, minD, userId);
            System.out.println("Daily diesel stock for date " + date + " has been saved.");
        } else {
            System.out.println("Daily diesel stock for date " + date + " already exists. Skipping save operation.");
        }

        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, new JREmptyDataSource());
        outputStream = new ByteArrayOutputStream();
        JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);
        return outputStream.toByteArray();
    }

    @GetMapping("/bakePage")
    public SellSummaryDTO getSummary(@RequestParam String date, @RequestParam String userId) {
        SellSummaryDTO sellSummaryDTO = new SellSummaryDTO();
        sellSummaryDTO.setKharchSellSummary(kharchrepository.findbyDate(date, userId));
        sellSummaryDTO.setTransactionSellSummary(transactionRepository.findbyDate(date, userId));
        sellSummaryDTO.setBakiSummary(JamabakiRepository.findByDateAndBakiGreaterThan(date, userId));
        sellSummaryDTO.setJamaSummary(JamabakiRepository.findByDateAndJamaGreaterThan(date, userId));
        return sellSummaryDTO;
    }

    @RequestMapping(value = "/pdfDataReport", method = RequestMethod.POST)
    public byte[] authenticateUser(@RequestParam("fileName") String fileName) {
        if (fileName == null) {
            return null;
        }
        if (!fileName.endsWith(".pdf") && !fileName.endsWith(".PDF")) {
            fileName = fileName + ".pdf";
        }
        try (InputStream input = DBConfig.class
                .getClassLoader().getResourceAsStream("application.properties")) {
            StringBuilder filterData = new StringBuilder();
            Properties prop = new Properties();

            prop.load(input);

            filterData.append(prop.getProperty("docs.file_path"));
            //File pdf = new File(filterData + fileName);

            Path path = Paths.get(filterData.toString() + fileName);
            byte[] pdf = Files.readAllBytes(path);

            if (Objects.isNull(pdf)) {
                return null;
            }
            return pdf;

        } catch (IOException ex) {
//            logger.error("authenticateUser0>>>>>>>>", ex);
        } catch (Exception ex) {
//            logger.error("authenticateUser1>>>>>>>>", ex);
        }
        return null;
    }

    // feedback from
    @PostMapping("/addFeedback")
    public feedback Setfeedback(@RequestBody feedback add) {
        feed.save(add);
        return add;
    }

    //Employee Deatils
    //Img share in angular
    @PostMapping("/addEmployees")
    public Employee createEmployee(@RequestParam("name") String name,
            @RequestParam("accountNumber") String accountNumber,
            @RequestParam("phoneNumber") String phoneNumber,
            @RequestParam("employeeId") String employeeId,
            @RequestParam("photo") MultipartFile photo,
            @RequestParam("userId") String userId) throws Exception {
        Employee employee = new Employee();
        employee.setName(name);
        employee.setAccountNumber(accountNumber);
        employee.setPhoneNumber(phoneNumber);
        employee.setEmployeeId(employeeId);
        employee.setPhoto(photo.getBytes());
        employee.setUserId(userId);
        return employeeRepository.save(employee);
    }

    @GetMapping("/employeesDataList")
    public List<Employee> getAllEmployees(@RequestParam String userId) {
        return employeeRepository.findByUserId(userId);
    }

    @GetMapping(value = "/customerName")
    public List<customer> getAllCustomer(@RequestParam String userId) {
        List<customer> customer = CustomerRepository.findByUserId(userId);
        return customer;
    }

    @GetMapping("/addImages")
    public ResponseEntity<List<Image>> Images() {
        List<Image> images = imageService.getAllImages();
        if (!images.isEmpty()) {
            return new ResponseEntity<>(images, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) throws IOException {
        Image savedImage = imageService.saveImage(file);
        return new ResponseEntity<>("Image uploaded successfully with ID: " + savedImage.getId(), HttpStatus.OK);
    }

    @GetMapping("/employeExpenses-And-Notes")
    public List<Object[]> getExpensesAndNotes(@RequestParam String notes, @RequestParam String userId) {
        return kharchrepository.findExpensesAndNotes(notes, userId);
    }

    @GetMapping("/JamaBakiShow")
    public List<jamabaki> getReports(
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate,
            @RequestParam("name") String name,
            @RequestParam("userId") String userId) {
        return JamabakiRepository.findByDateBetweenAndNameLikeAndUserId(startDate, endDate, name, userId);
    }

    //DASHBOARD
    @GetMapping("/dateTodateTotal")
    public ResponseEntity<List<dailytotal>> getEntriesWithinDateRange(
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate,
            @RequestParam("userId") String userId) {

        List<dailytotal> entries = DailytotalRepository.findByDateBetweenAndUserId(startDate, endDate, userId);
        return new ResponseEntity<>(entries, HttpStatus.OK);
    }

    @GetMapping("/dailytotal")
    public List<dailytotal> getTodayDailytotals(@RequestParam String userId) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String todayDate = sdf.format(new Date());
        return DailytotalRepository.findByDateAndUserId(todayDate, userId);
    }

    @GetMapping("/totalsum/currentmonth")
    public Long getTotalSumForCurrentMonth(@RequestParam String userId) {
        return DailytotalRepository.findTotalSumForCurrentMonth(userId);
    }

    @GetMapping("/totalsum/currentyear")
    public Long getTotalSumForCurrentYear(@RequestParam String userId) {
        return DailytotalRepository.findTotalSumForCurrentYear(userId);
    }

    @GetMapping("/dailyChart")
    public DailySalesSummaryDTO getSalesReport(@RequestParam String userId) {
        String sql = "SELECT "
                + "p.date, "
                + "p.PetrolSell_Total, "
                + "d.DieselSell_Total, "
                + "o.OilSell_Total, "
                + "k.Kharch_Total, "
                + "t.Atm_total, "
                + "j.Jama_Total, "
                + "j.baki_Total, "
                + "purchase.total_petrol_purchase, "
                + "purchase.total_diesel_purchase "
                + "FROM "
                + "(SELECT date, SUM(total_sell) AS PetrolSell_Total FROM managment.petrolsell WHERE date = CURDATE() AND user_id = ?) p "
                + "JOIN "
                + "(SELECT date, SUM(total_sell) AS DieselSell_Total FROM managment.dieselsell WHERE date = CURDATE() AND user_id = ?) d ON p.date = d.date "
                + "JOIN "
                + "(SELECT date, SUM(price) AS OilSell_Total FROM managment.oilsell WHERE date = CURDATE() AND user_id = ?) o ON p.date = o.date "
                + "JOIN "
                + "(SELECT date, SUM(price) AS Kharch_Total FROM managment.kharch WHERE date = CURDATE() AND user_id = ?) k ON p.date = k.date "
                + "JOIN "
                + "(SELECT date, SUM(amount) AS Atm_total FROM managment.transaction WHERE date = CURDATE() AND user_id = ?) t ON p.date = t.date "
                + "JOIN "
                + "(SELECT date, SUM(jama) AS Jama_Total, SUM(baki) AS baki_Total FROM managment.jamabakireport WHERE date = CURDATE() AND user_id = ?) j ON p.date = j.date "
                + "LEFT JOIN "
                + "(SELECT "
                + "date, "
                + "SUM(CASE WHEN type = 'petrol' THEN total_purchase ELSE 0 END) AS total_petrol_purchase, "
                + "SUM(CASE WHEN type = 'diesel' THEN total_purchase ELSE 0 END) AS total_diesel_purchase "
                + "FROM "
                + "managment.purchase "
                + "WHERE "
                + "date = CURDATE() AND user_id = ? "
                + "GROUP BY "
                + "date "
                + ") purchase ON p.date = purchase.date";

        List<DailySalesSummaryDTO> results = jdbcTemplate.query(sql, new Object[]{userId, userId, userId, userId, userId, userId, userId}, (rs, rowNum) -> {
            DailySalesSummaryDTO salesSummary = new DailySalesSummaryDTO();
            salesSummary.setDate(rs.getDate("date").toString());
            salesSummary.setPetrolSellTotal(rs.getDouble("PetrolSell_Total"));
            salesSummary.setDieselSellTotal(rs.getDouble("DieselSell_Total"));
            salesSummary.setOilSellTotal(rs.getDouble("OilSell_Total"));
            salesSummary.setKharchTotal(rs.getDouble("Kharch_Total"));
            salesSummary.setAtmTotal(rs.getDouble("Atm_total"));
            salesSummary.setJamaTotal(rs.getDouble("Jama_Total"));
            salesSummary.setBakiTotal(rs.getDouble("baki_Total"));
            salesSummary.setTotalPetrolPurchase(rs.getDouble("total_petrol_purchase"));
            salesSummary.setTotalDieselPurchase(rs.getDouble("total_diesel_purchase"));
            return salesSummary;
        });
        return results.isEmpty() ? null : results.get(0);
    }

    @GetMapping("/petrol-year-total")
    public Double getTotalPetrolLtrForCurrentYear(@RequestParam String userId) {
        return petrolSellRepository.findTotalPetrolLtrForCurrentYear(userId);
    }

    @GetMapping("/diesel-year-total")
    public Double getTotalDieselLtrForCurrentYear(@RequestParam String userId) {
        return dieselSellRepository.findTotalDieselLtrForCurrentYear(userId);
    }

    @GetMapping("/jamabaki-year-total")
    public Double getTotalJamaBakiForCurrentYear(@RequestParam String userId) {
        return JamabakiRepository.findJamaBakiDifferenceForCurrentYear(userId);
    }

    @PostMapping("/Dipstock")
    public ResponseEntity<?> setDipstock(@RequestBody DipStock dip) {
        // Check if a DipStock with the same date already exists
        Optional<DipStock> existingDipStock = dipStockRepository.findByDate(dip.getDate());
        if (existingDipStock.isPresent()) {
            // Return an error message
            return ResponseEntity.status(HttpStatus.CONFLICT).body("DipStock with this date already exists.");
        } else {
            dipStockRepository.save(dip);
            return ResponseEntity.ok(dip);
        }
    }

    //    @GetMapping("/dataForDate")
//    public List<Object[]> getDataForDate(@RequestParam("date")
//            @DateTimeFormat(pattern = "yyyy-MM-dd") String date) {
//        return purchaseRepository.getDataForDate(date);
//    }
//    @PostMapping("/kharch")
//    public kharch Setkharch(@RequestBody kharch add) {
//        kharchrepository.save(add);
//        return add;
//    }
//    @PostMapping("/kharch")
//    public List<kharch> setKharch(@RequestBody Map<String, Object> requestBody) {
//        List<Map<String, Object>> expenses = (List<Map<String, Object>>) requestBody.get("expenses");
//        List<kharch> savedList = new ArrayList<>();
//
//        for (Map<String, Object> expense : expenses) {
//            kharch kharch = new kharch();
//            kharch.setDate((String) requestBody.get("date")); // Assuming Date type for date property
//            kharch.setNotes((String) expense.get("notes"));
//            kharch.setPrice((String) expense.get("price")); // Assuming Double type for price property
//
//            kharch savedKharch = kharchrepository.save(kharch);
//            savedList.add(savedKharch);
//        }
//
//        return savedList;
//    }
    //Add Customer
    @PostMapping("/addCustomer")
    public ResponseEntity<?> setCustomer(@RequestBody customer add) {
        // Check if customer name already exists
        Optional<customer> existingCustomer = CustomerRepository.findByName(add.getName());

        if (existingCustomer.isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Customer with the name '" + add.getName() + "' already exists.");
        }

        add.setIdcustomer(null); // ensure it's a new record
        CustomerRepository.save(add);
        return ResponseEntity.ok(add);
    }


    @PostMapping("/updateCustomer")
    public ResponseEntity<ApiResponse> updatePurchase(@RequestBody customer Customer) {
        CustomerRepository.save(Customer);
        ApiResponse response = new ApiResponse("customer updated and saved successfully");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/customer/{id}")
    public ResponseEntity<ApiResponse> deletecustomerdata(@PathVariable Integer id) {
        try {
            CustomerRepository.deleteById(id);
            ApiResponse response = new ApiResponse("Entity deleted successfully");
            return ResponseEntity.ok(response);
        } catch (EmptyResultDataAccessException ex) {
            return ResponseEntity.notFound().build(); // ID not found
        }
    }

    @GetMapping("/jama/{date}")
    public List<Object[]> getJamaList(@PathVariable String date) {
        return JamabakiRepository.findJamaSumByDate(date);
    }

    @GetMapping("/baki/{date}")
    public List<Object[]> getJamabakiByReceiverPump(@PathVariable String date) {
        return JamabakiRepository.findBakiSumByDate(date);
    }

    @GetMapping("/kharchtotal")
    public List<Object[]> getKharchData() throws java.text.ParseException {
        List<Object[]> dateAndTotalPriceList = (List<Object[]>) kharchrepository.findDateAndTotalPrice();
        List<Object[]> formattedDataList = new ArrayList<>();
        SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd");
        SimpleDateFormat outputFormat = new SimpleDateFormat("dd/MM/yyyy");
        for (Object[] row : dateAndTotalPriceList) {
            // Assuming the first element is the date
            Date date = inputFormat.parse(row[0].toString());
            String formattedDate = outputFormat.format(date);
            // Replace the date in the row with the formatted date
            row[0] = formattedDate;

            formattedDataList.add(row);
        }

        // Print the formatted data if needed
        for (Object[] row : formattedDataList) {
            System.out.println("Date: " + row[0] + ", Total Price: " + row[1]);
        }

        return formattedDataList;
    }

    @GetMapping("/findersenderrecevier")
    public List<jamabaki> getTransactions(@RequestParam String name) {
//        return JamabakiRepository.findBySenderOrReceiver(name, name);
        return null;

    }

    // Petrol/Diesel  Dip
    @GetMapping("/practicedip/{id}")
    public Double getPracticedipById(@PathVariable("id") Integer id) {
        // Fetch volume by id using the repository method
        Double volume = dipvalueRepository.findVolumeById(id);
        return volume;
    }

    @GetMapping("/petrol-sell-summary")
    public List<Object[]> getPetrolSellSummary(@RequestParam String startDate,
            @RequestParam String endDate) {
        return petrolSellRepository.findPetrolSellSummaryBetweenDates(startDate, endDate);
    }

    @GetMapping("/diesel-sell-summary")
    public List<Object[]> getDieselSellSummary(@RequestParam String startDate,
            @RequestParam String endDate) {
        return dieselSellRepository.findDieselSellSummaryBetweenDates(startDate, endDate);
    }

    @GetMapping("/oil-sell-summary")
    public List<Object[]> getOilSellSummary(@RequestParam String startDate,
            @RequestParam String endDate) {
        return oilSellRepository.findOilSellSummaryBetweenDates(startDate, endDate);
    }

    @GetMapping("/kharch-sell-summary")
    public List<Object[]> getKharchSellSummary(@RequestParam String startDate,
            @RequestParam String endDate) {
        return kharchrepository.findKharchSellSummaryBetweenDates(startDate, endDate);
    }

    @GetMapping("/atm-sell-summary")
    public List<Object[]> gettransactionSellSummary(@RequestParam String startDate,
            @RequestParam String endDate) {
        return transactionRepository.findTransactionSellSummaryBetweenDates(startDate, endDate);
    }

    @GetMapping("/jamabaki-sell-summary")
    public List<Object[]> getJamaBakiSummary(@RequestParam String startDate,
            @RequestParam String endDate) {
        return JamabakiRepository.findJamaBakiSummaryBetweenDates(startDate, endDate);
    }

    @GetMapping("/purchase-sell-summary")
    public List<Object[]> getPurchasesBetweenDates(@RequestParam String startDate,
            @RequestParam String endDate) {
        return purchaseRepository.findPurchasesBetweenDates(startDate, endDate);
    }

    //Daily Report
    @GetMapping("/aggregated-data-alldata")
    public List<AggregatedDataDTO> getAggregatedData(
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam String userId) {

        List<Map<String, Object>> myobj = queryThis(startDate, endDate, userId);
        List<AggregatedDataDTO> result = new ArrayList<>();
        for (Map<String, Object> map : myobj) {
            AggregatedDataDTO dto = new AggregatedDataDTO();
            dto.setDate((String) map.get("date"));
            dto.setPetrolTotalCloseMeter(convertToDouble(map.get("petrol_total_close_meter")));
            dto.setPetrolTotalOpenMeter(convertToDouble(map.get("petrol_total_open_meter")));
            dto.setPetrolTotalSum(convertToDouble(map.get("petrol_total_sum")));
            dto.setPetrolTotalTesting(convertToDouble(map.get("petrol_total_testing")));
            dto.setPetrolLtr(convertToDouble(map.get("petrol_ltr")));
            dto.setPetrolRate(convertToDouble(map.get("petrol_rate")));
            dto.setPetrolTotalTotalSell(convertToDouble(map.get("petrol_total_total_sell")));
            dto.setDieselTotalCloseMeter(convertToDouble(map.get("diesel_total_close_meter")));
            dto.setDieselTotalOpenMeter(convertToDouble(map.get("diesel_total_open_meter")));
            dto.setDieselTotalSum(convertToDouble(map.get("diesel_total_sum")));
            dto.setDieselTotalTesting(convertToDouble(map.get("diesel_total_testing")));
            dto.setDieselLtr(convertToDouble(map.get("diesel_ltr")));
            dto.setDieselRate(convertToDouble(map.get("diesel_rate")));
            dto.setDieselTotalTotalSell(convertToDouble(map.get("diesel_total_total_sell")));
            dto.setOilTotalPrice(convertToDouble(map.get("oil_total_price")));
            dto.setKharchTotal(convertToDouble(map.get("Kharch_Total")));
            dto.setpType(convertToInteger(map.get("PType")));
            dto.setPetrolQuantity(convertToDouble(map.get("Petrol_Quantity")));
            dto.setPetrolTotal(convertToDouble(map.get("Petrol_Total")));
            dto.setPetrolVat(convertToDouble(map.get("Petrol_Vat")));
            dto.setPetrolCess(convertToDouble(map.get("Petrol_Cess")));
            dto.setPetrolJtcpercentage(convertToDouble(map.get("Petrol_Jtcpercentage")));
            dto.setPetrolTotalPurchase(convertToDouble(map.get("Petrol_Total_purchase")));
            dto.setdType(convertToInteger(map.get("DType")));
            dto.setDieselQuantity(convertToDouble(map.get("Diesel_Quantity")));
            dto.setDieselTotal(convertToDouble(map.get("Diesel_Total")));
            dto.setDieselVat(convertToDouble(map.get("Diesel_Vat")));
            dto.setDieselCess(convertToDouble(map.get("Diesel_Cess")));
            dto.setDieselJtcpercentage(convertToDouble(map.get("Diesel_Jtcpercentage")));
            dto.setDieselTotalPurchase(convertToDouble(map.get("Diesel_Total_Purchase")));
            dto.setAmountTotal(convertToDouble(map.get("Amount_Total")));
            dto.setJamaTotal(convertToDouble(map.get("Jama_Total")));
            dto.setBakiTotal(convertToDouble(map.get("Baki_Total")));
            dto.setUser_id((String) map.get("user_id"));

dto.setXppetrolCloseMeter(convertToDouble(map.get("xppetrol_close_meter")));
dto.setXppetrolOpenMeter(convertToDouble(map.get("xppetrol_open_meter")));
dto.setXppetrolLtr(convertToDouble(map.get("xppetrol_ltr")));
dto.setXppetrolTotalSum(convertToDouble(map.get("xppetrol_total_sum")));
dto.setXppetrolTotalTesting(convertToDouble(map.get("xppetrol_total_testing")));
dto.setXppetrolTotalSell(convertToDouble(map.get("xppetrol_total_sell")));

dto.setPowerdieselCloseMeter(convertToDouble(map.get("powerdiesel_close_meter")));
dto.setPowerdieselOpenMeter(convertToDouble(map.get("powerdiesel_open_meter")));
dto.setPowerdieselLtr(convertToDouble(map.get("powerdiesel_ltr")));
dto.setPowerdieselTotalSum(convertToDouble(map.get("powerdiesel_total_sum")));
dto.setPowerdieselTotalTesting(convertToDouble(map.get("powerdiesel_total_testing")));
dto.setPowerdieselTotalSell(convertToDouble(map.get("powerdiesel_total_sell")));

            result.add(dto);
        }
        return result;
    }

    private Double convertToDouble(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof Number) {
            return ((Number) value).doubleValue();
        }
        try {
            return Double.parseDouble(value.toString());
        } catch (NumberFormatException e) {
            return null; // or handle the error as needed
        }
    }

    private Integer convertToInteger(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof Number) {
            return ((Number) value).intValue();
        }
        try {
            return Integer.parseInt(value.toString());
        } catch (NumberFormatException e) {
            return null; // or handle the error as needed
        }
    }

    private List<Map<String, Object>> queryThis(String startDate, String endDate, String userId) {
        String sql = "SELECT "
                + "p.date, "
                + "COALESCE(p.total_close_meter, 0) AS petrol_total_close_meter, "
                + "COALESCE(p.total_open_meter, 0) AS petrol_total_open_meter, "
                + "COALESCE(p.total_sum, 0) AS petrol_total_sum, "
                + "COALESCE(p.total_testing, 0) AS petrol_total_testing, "
                + "COALESCE(p.petrol_ltr, 0) AS petrol_ltr, "
                + "COALESCE(p.rate, 0) AS petrol_rate, "
                + "COALESCE(p.total_total_sell, 0) AS petrol_total_total_sell, "
                + "COALESCE(d.total_close_meter, 0) AS diesel_total_close_meter, "
                + "COALESCE(d.total_open_meter, 0) AS diesel_total_open_meter, "
                + "COALESCE(d.total_sum, 0) AS diesel_total_sum, "
                + "COALESCE(d.total_testing, 0) AS diesel_total_testing, "
                + "COALESCE(d.diesel_ltr, 0) AS diesel_ltr, "
                + "COALESCE(d.rate, 0) AS diesel_rate, "
                + "COALESCE(d.total_total_sell, 0) AS diesel_total_total_sell, "
            // xppetrol
            + "COALESCE(xp.total_close_meter, 0) AS xppetrol_close_meter, "
            + "COALESCE(xp.total_open_meter, 0) AS xppetrol_open_meter, "
            + "COALESCE(xp.xppetrol_ltr, 0) AS xppetrol_ltr, "
            + "COALESCE(xp.total_sum, 0) AS xppetrol_total_sum, "
            + "COALESCE(xp.total_testing, 0) AS xppetrol_total_testing, "
            + "COALESCE(xp.total_sell, 0) AS xppetrol_total_sell, "

            // powerdiesel
            + "COALESCE(pd.total_close_meter, 0) AS powerdiesel_close_meter, "
            + "COALESCE(pd.total_open_meter, 0) AS powerdiesel_open_meter, "
            + "COALESCE(pd.powerdiesel_ltr, 0) AS powerdiesel_ltr, "
            + "COALESCE(pd.total_sum, 0) AS powerdiesel_total_sum, "
            + "COALESCE(pd.total_testing, 0) AS powerdiesel_total_testing, "
            + "COALESCE(pd.total_sell, 0) AS powerdiesel_total_sell, "

                + "COALESCE(o.total_price, 0) AS oil_total_price, "
                + "COALESCE(k.Kharch_Total, 0) AS Kharch_Total, "
                + "COALESCE(pp.type, 0) AS PType, "
                + "COALESCE(pp.petrol_quantity, 0) AS Petrol_Quantity, "
                + "COALESCE(pp.petrol_total, 0) AS Petrol_Total, "
                + "COALESCE(pp.petrol_vat, 0) AS Petrol_Vat, "
                + "COALESCE(pp.petrol_cess, 0) AS Petrol_Cess, "
                + "COALESCE(pp.petrol_jtcpercentage, 0) AS Petrol_Jtcpercentage, "
                + "COALESCE(pp.petrol_total_purchase, 0) AS Petrol_Total_Purchase, "
                + "COALESCE(dp.type, 0) AS DType, "
                + "COALESCE(dp.diesel_quantity, 0) AS Diesel_Quantity, "
                + "COALESCE(dp.diesel_total, 0) AS Diesel_Total, "
                + "COALESCE(dp.diesel_vat, 0) AS Diesel_Vat, "
                + "COALESCE(dp.diesel_cess, 0) AS Diesel_Cess, "
                + "COALESCE(dp.diesel_jtcpercentage, 0) AS Diesel_Jtcpercentage, "
                + "COALESCE(dp.diesel_total_purchase, 0) AS Diesel_Total_Purchase, "
                + "COALESCE(t.Amount_Total, 0) AS Amount_Total, "
                + "COALESCE(j.Jama_Total, 0) AS Jama_Total, "
                + "COALESCE(j.Baki_Total, 0) AS Baki_Total "
                + "FROM "
                + "(SELECT "
                + "date, "
                + "SUM(close_meter) AS total_close_meter, "
                + "SUM(open_meter) AS total_open_meter, "
                + "SUM(total) AS total_sum, "
                + "SUM(testing) AS total_testing, "
                + "SUM(petrol_ltr) AS petrol_ltr, "
                + "rate, "
                + "SUM(total_sell) AS total_total_sell "
                + "FROM "
                + "managment.petrolsell "
                + "WHERE "
                + "date BETWEEN '" + startDate + "' AND '" + endDate + "' "
                + "AND user_id = '" + userId + "' " // Filter by userId
                + "GROUP BY "
                + "date, rate) p "
                + "JOIN "
                + "(SELECT "
                + "date, "
                + "SUM(close_meter) AS total_close_meter, "
                + "SUM(open_meter) AS total_open_meter, "
                + "SUM(total) AS total_sum, "
                + "SUM(testing) AS total_testing, "
                + "SUM(diesel_ltr) AS diesel_ltr, "
                + "rate, "
                + "SUM(total_sell) AS total_total_sell "
                + "FROM "
                + "managment.dieselsell "
                + "WHERE "
                + "date BETWEEN  '" + startDate + "' AND '" + endDate + "' "
                + "AND user_id = '" + userId + "' " // Filter by userId
                + "GROUP BY "
                + "date, rate) d "
                + "ON "
                + "p.date = d.date "
                + "LEFT JOIN "
                + "(SELECT "
                + "date, "
                + "SUM(price) AS total_price "
                + "FROM "
                + "managment.OilSell "
                + "WHERE "
                + "date BETWEEN  '" + startDate + "' AND '" + endDate + "' "
                + "AND user_id = '" + userId + "' " // Filter by userId
                + "GROUP BY "
                + "date) o "
                + "ON "
                + "p.date = o.date "
                + "LEFT JOIN "
                + "(SELECT "
                + "date, "
                + "SUM(price) AS Kharch_Total "
                + "FROM "
                + "managment.kharch "
                + "WHERE "
                + "date BETWEEN '" + startDate + "' AND '" + endDate + "' "
                + "AND user_id = '" + userId + "' " // Filter by userId
                + "GROUP BY "
                + "date) k "
                + "ON "
                + "p.date = k.date "
                + "LEFT JOIN "
                + "(SELECT "
                + "date, type, "
                + "quantity AS petrol_quantity, "
                + "total AS petrol_total, "
                + "vat AS petrol_vat, "
                + "cess AS petrol_cess, "
                + "jtcpercentage AS petrol_jtcpercentage, "
                + "total_purchase AS petrol_total_purchase "
                + "FROM "
                + "managment.purchase "
                + "WHERE "
                + "type = 'petrol' AND user_id = '" + userId + "') pp " // Filter by userId
                + "ON "
                + "p.date = pp.date "
                + "LEFT JOIN "
                + "(SELECT "
                + "date, "
                + "SUM(amount) AS Amount_Total "
                + "FROM "
                + "managment.transaction "
                + "WHERE "
                + "date BETWEEN '" + startDate + "' AND '" + endDate + "' "
                + "AND user_id = '" + userId + "' " // Filter by userId
                + "GROUP BY "
                + "date) t "
                + "ON "
                + "p.date = t.date "
                + "LEFT JOIN "
                + "(SELECT "
                + "date, type, "
                + "quantity AS diesel_quantity, "
                + "total AS diesel_total, "
                + "vat AS diesel_vat, "
                + "cess AS diesel_cess, "
                + "jtcpercentage AS diesel_jtcpercentage, "
                + "total_purchase AS diesel_total_purchase "
                + "FROM "
                + "managment.purchase "
                + "WHERE "
                + "type = 'diesel'  AND user_id = '" + userId + "') dp " // Filter by userId
                + "ON "
                + "d.date = dp.date "
                + "LEFT JOIN "
                + "(SELECT "
                + "date, "
                + "SUM(jama) AS Jama_Total, "
                + "SUM(baki) AS Baki_Total "
                + "FROM "
                + "managment.jamabakireport "
                + "WHERE "
                + "date BETWEEN '" + startDate + "' AND '" + endDate + "' "
                + "AND user_id = '" + userId + "' " // Filter by userId
                + "GROUP BY "
                + "date) j "
                + "ON "
                + " p.date = j.date "

            + "LEFT JOIN (SELECT date, "
            + "SUM(close_meter) AS total_close_meter, "
            + "SUM(open_meter) AS total_open_meter, "
            + "SUM(xppetrol_ltr) AS xppetrol_ltr, "
            + "SUM(testing) AS total_testing, "
            + "SUM(total) AS total_sum, "
            + "SUM(total_sell) AS total_sell "
            + "FROM managment.xppetrol "
            + "WHERE date BETWEEN '" + startDate + "' AND '" + endDate + "' "
            + "AND user_id = '" + userId + "' "
            + "GROUP BY date) xp ON p.date = xp.date "

            // ✅ LEFT JOIN powerdiesel
            + "LEFT JOIN (SELECT date, "
            + "SUM(close_meter) AS total_close_meter, "
            + "SUM(open_meter) AS total_open_meter, "
            + "SUM(powerdiesel_ltr) AS powerdiesel_ltr, "
            + "SUM(testing) AS total_testing, "
            + "SUM(total) AS total_sum, "
            + "SUM(total_sell) AS total_sell "
            + "FROM managment.powerdiesel "
            + "WHERE date BETWEEN '" + startDate + "' AND '" + endDate + "' "
            + "AND user_id = '" + userId + "' "
            + "GROUP BY date) pd ON p.date = pd.date "
                + "ORDER BY "
                + "p.date;";

        return jdbcTemplate.queryForList(sql);
    }

    //    private List<Map<String, Object>> queryThis(String startDate, String endDate, String userId) {
//        String sql = "SELECT "
//                + "p.date, "
//                + "COALESCE(p.total_close_meter, 0) AS petrol_total_close_meter, "
//                + "COALESCE(p.total_open_meter, 0) AS petrol_total_open_meter, "
//                + "COALESCE(p.total_sum, 0) AS petrol_total_sum, "
//                + "COALESCE(p.total_testing, 0) AS petrol_total_testing, "
//                + "COALESCE(p.petrol_ltr, 0) AS petrol_ltr, "
//                + "COALESCE(p.rate, 0) AS petrol_rate, "
//                + "COALESCE(p.total_total_sell, 0) AS petrol_total_total_sell, "
//                + "COALESCE(d.total_close_meter, 0) AS diesel_total_close_meter, "
//                + "COALESCE(d.total_open_meter, 0) AS diesel_total_open_meter, "
//                + "COALESCE(d.total_sum, 0) AS diesel_total_sum, "
//                + "COALESCE(d.total_testing, 0) AS diesel_total_testing, "
//                + "COALESCE(d.diesel_ltr, 0) AS diesel_ltr, "
//                + "COALESCE(d.rate, 0) AS diesel_rate, "
//                + "COALESCE(d.total_total_sell, 0) AS diesel_total_total_sell, "
//                + "COALESCE(o.total_price, 0) AS oil_total_price, "
//                + "COALESCE(k.Kharch_Total, 0) AS Kharch_Total, "
//                + "COALESCE(pp.type, 0) AS PType, "
//                + "COALESCE(pp.petrol_quantity, 0) AS Petrol_Quantity, "
//                + "COALESCE(pp.petrol_total, 0) AS Petrol_Total, "
//                + "COALESCE(pp.petrol_vat, 0) AS Petrol_Vat, "
//                + "COALESCE(pp.petrol_cess, 0) AS Petrol_Cess, "
//                + "COALESCE(pp.petrol_jtcpercentage, 0) AS Petrol_Jtcpercentage, "
//                + "COALESCE(pp.petrol_total_purchase, 0) AS Petrol_Total_Purchase, "
//                + "COALESCE(dp.type, 0) AS DType, "
//                + "COALESCE(dp.diesel_quantity, 0) AS Diesel_Quantity, "
//                + "COALESCE(dp.diesel_total, 0) AS Diesel_Total, "
//                + "COALESCE(dp.diesel_vat, 0) AS Diesel_Vat, "
//                + "COALESCE(dp.diesel_cess, 0) AS Diesel_Cess, "
//                + "COALESCE(dp.diesel_jtcpercentage, 0) AS Diesel_Jtcpercentage, "
//                + "COALESCE(dp.diesel_total_purchase, 0) AS Diesel_Total_Purchase, "
//                + "COALESCE(t.Amount_Total, 0) AS Amount_Total, "
//                + "COALESCE(j.Jama_Total, 0) AS Jama_Total, "
//                + "COALESCE(j.Baki_Total, 0) AS Baki_Total "
//                + "FROM "
//                + "(SELECT "
//                + "date, "
//                + "SUM(close_meter) AS total_close_meter, "
//                + "SUM(open_meter) AS total_open_meter, "
//                + "SUM(total) AS total_sum, "
//                + "SUM(testing) AS total_testing, "
//                + "SUM(petrol_ltr) AS petrol_ltr, "
//                + "rate, "
//                + "SUM(total_sell) AS total_total_sell "
//                + "FROM "
//                + "managment.petrolsell "
//                + "WHERE "
//                + "date BETWEEN '" + startDate + "' AND '" + endDate + "' "
//                + "AND user_id = '" + userId + "' " // Filter by userId
//                + "GROUP BY "
//                + "date, rate) p "
//                + "JOIN "
//                + "(SELECT "
//                + "date, "
//                + "SUM(close_meter) AS total_close_meter, "
//                + "SUM(open_meter) AS total_open_meter, "
//                + "SUM(total) AS total_sum, "
//                + "SUM(testing) AS total_testing, "
//                + "SUM(diesel_ltr) AS diesel_ltr, "
//                + "rate, "
//                + "SUM(total_sell) AS total_total_sell "
//                + "FROM "
//                + "managment.dieselsell "
//                + "WHERE "
//                + "date BETWEEN  '" + startDate + "' AND '" + endDate + "' "
//                + "AND user_id = '" + userId + "' " // Filter by userId
//                + "GROUP BY "
//                + "date, rate) d "
//                + "ON "
//                + "p.date = d.date "
//                + "LEFT JOIN "
//                + "(SELECT "
//                + "date, "
//                + "SUM(price) AS total_price "
//                + "FROM "
//                + "managment.OilSell "
//                + "WHERE "
//                + "date BETWEEN  '" + startDate + "' AND '" + endDate + "' "
//                + "AND user_id = '" + userId + "' " // Filter by userId
//                + "GROUP BY "
//                + "date) o "
//                + "ON "
//                + "p.date = o.date "
//                + "LEFT JOIN "
//                + "(SELECT "
//                + "date, "
//                + "SUM(price) AS Kharch_Total "
//                + "FROM "
//                + "managment.kharch "
//                + "WHERE "
//                + "date BETWEEN '" + startDate + "' AND '" + endDate + "' "
//                + "AND user_id = '" + userId + "' " // Filter by userId
//                + "GROUP BY "
//                + "date) k "
//                + "ON "
//                + "p.date = k.date "
//                + "LEFT JOIN "
//                + "(SELECT "
//                + "date, type, "
//                + "quantity AS petrol_quantity, "
//                + "total AS petrol_total, "
//                + "vat AS petrol_vat, "
//                + "cess AS petrol_cess, "
//                + "jtcpercentage AS petrol_jtcpercentage, "
//                + "total_purchase AS petrol_total_purchase "
//                + "FROM "
//                + "managment.purchase "
//                + "WHERE "
//                + "type = 'petrol' AND user_id = '" + userId + "') pp " // Filter by userId
//                + "ON "
//                + "p.date = pp.date "
//                + "LEFT JOIN "
//                + "(SELECT "
//                + "date, "
//                + "SUM(amount) AS Amount_Total "
//                + "FROM "
//                + "managment.transaction "
//                + "WHERE "
//                + "date BETWEEN '" + startDate + "' AND '" + endDate + "' "
//                + "AND user_id = '" + userId + "' " // Filter by userId
//                + "GROUP BY "
//                + "date) t "
//                + "ON "
//                + "p.date = t.date "
//                + "LEFT JOIN "
//                + "(SELECT "
//                + "date, type, "
//                + "quantity AS diesel_quantity, "
//                + "total AS diesel_total, "
//                + "vat AS diesel_vat, "
//                + "cess AS diesel_cess, "
//                + "jtcpercentage AS diesel_jtcpercentage, "
//                + "total_purchase AS diesel_total_purchase "
//                + "FROM "
//                + "managment.purchase "
//                + "WHERE "
//                + "type = 'diesel' AND user_id = '" + userId + "') dp " // Filter by userId
//                + "ON "
//                + "d.date = dp.date "
//                + "LEFT JOIN "
//                + "(SELECT "
//                + "date, "
//                + "SUM(jama) AS Jama_Total, "
//                + "SUM(baki) AS Baki_Total "
//                + "FROM "
//                + "managment.jamabakireport "
//                + "WHERE "
//                + "date BETWEEN '" + startDate + "' AND '" + endDate + "' "
//                + "AND user_id = '" + userId + "' " // Filter by userId
//                + "GROUP BY "
//                + "date) j "
//                + "ON "
//                + " p.date = j.date "
//                + "ORDER BY "
//                + "p.date;";
//
//        return jdbcTemplate.queryForList(sql);
//    }
//    private List<Map<String, Object>> queryThis(String startDate, String endDate, String userId) {
//        String sql = "SELECT "
//                + "p.date, "
//                + "COALESCE(p.total_close_meter, 0) AS petrol_total_close_meter, "
//                + "COALESCE(p.total_open_meter, 0) AS petrol_total_open_meter, "
//                + "COALESCE(p.total_sum, 0) AS petrol_total_sum, "
//                + "COALESCE(p.total_testing, 0) AS petrol_total_testing, "
//                + "COALESCE(p.petrol_ltr, 0) AS petrol_ltr, "
//                + "COALESCE(p.rate, 0) AS petrol_rate, "
//                + "COALESCE(p.total_total_sell, 0) AS petrol_total_total_sell, "
//                + "COALESCE(d.total_close_meter, 0) AS diesel_total_close_meter, "
//                + "COALESCE(d.total_open_meter, 0) AS diesel_total_open_meter, "
//                + "COALESCE(d.total_sum, 0) AS diesel_total_sum, "
//                + "COALESCE(d.total_testing, 0) AS diesel_total_testing, "
//                + "COALESCE(d.diesel_ltr, 0) AS diesel_ltr, "
//                + "COALESCE(d.rate, 0) AS diesel_rate, "
//                + "COALESCE(d.total_total_sell, 0) AS diesel_total_total_sell, "
//                + "COALESCE(o.total_price, 0) AS oil_total_price, "
//                + "COALESCE(k.Kharch_Total, 0) AS Kharch_Total, "
//                + "COALESCE(pp.type, 0) AS PType, "
//                + "COALESCE(pp.petrol_quantity, 0) AS Petrol_Quantity, "
//                + "COALESCE(pp.petrol_total, 0) AS Petrol_Total, "
//                + "COALESCE(pp.petrol_vat, 0) AS Petrol_Vat, "
//                + "COALESCE(pp.petrol_cess, 0) AS Petrol_Cess, "
//                + "COALESCE(pp.petrol_jtcpercentage, 0) AS Petrol_Jtcpercentage, "
//                + "COALESCE(pp.petrol_total_purchase, 0) AS Petrol_Total_Purchase, "
//                + "COALESCE(dp.type, 0) AS DType, "
//                + "COALESCE(dp.diesel_quantity, 0) AS Diesel_Quantity, "
//                + "COALESCE(dp.diesel_total, 0) AS Diesel_Total, "
//                + "COALESCE(dp.diesel_vat, 0) AS Diesel_Vat, "
//                + "COALESCE(dp.diesel_cess, 0) AS Diesel_Cess, "
//                + "COALESCE(dp.diesel_jtcpercentage, 0) AS Diesel_Jtcpercentage, "
//                + "COALESCE(dp.diesel_total_purchase, 0) AS Diesel_Total_Purchase, "
//                + "COALESCE(t.Amount_Total, 0) AS Amount_Total, "
//                + "COALESCE(j.Jama_Total, 0) AS Jama_Total, "
//                + "COALESCE(j.Baki_Total, 0) AS Baki_Total "
//                + "FROM "
//                + "(SELECT "
//                + "date, "
//                + "SUM(close_meter) AS total_close_meter, "
//                + "SUM(open_meter) AS total_open_meter, "
//                + "SUM(total) AS total_sum, "
//                + "SUM(testing) AS total_testing, "
//                + "SUM(petrol_ltr) AS petrol_ltr, "
//                + "rate, "
//                + "SUM(total_sell) AS total_total_sell "
//                + "FROM "
//                + "managment.petrolsell "
//                + "WHERE "
//                + "date BETWEEN '" + startDate + "' AND '" + endDate + "' "
//                + "AND user_id = '" + userId + "' " // Filter by userId
//                + "GROUP BY "
//                + "date, rate) p "
//                + "JOIN "
//                + "(SELECT "
//                + "date, "
//                + "SUM(close_meter) AS total_close_meter, "
//                + "SUM(open_meter) AS total_open_meter, "
//                + "SUM(total) AS total_sum, "
//                + "SUM(testing) AS total_testing, "
//                + "SUM(diesel_ltr) AS diesel_ltr, "
//                + "rate, "
//                + "SUM(total_sell) AS total_total_sell "
//                + "FROM "
//                + "managment.dieselsell "
//                + "WHERE "
//                + "date BETWEEN  '" + startDate + "' AND '" + endDate + "' "
//                + "AND user_id = '" + userId + "' " // Filter by userId
//                + "GROUP BY "
//                + "date, rate) d "
//                + "ON "
//                + "p.date = d.date "
//                + "LEFT JOIN "
//                + "(SELECT "
//                + "date, "
//                + "SUM(price) AS total_price "
//                + "FROM "
//                + "managment.OilSell "
//                + "WHERE "
//                + "date BETWEEN  '" + startDate + "' AND '" + endDate + "' "
//                + "AND user_id = '" + userId + "' " // Filter by userId
//                + "GROUP BY "
//                + "date) o "
//                + "ON "
//                + "p.date = o.date "
//                + "LEFT JOIN "
//                + "(SELECT "
//                + "date, "
//                + "SUM(price) AS Kharch_Total "
//                + "FROM "
//                + "managment.kharch "
//                + "WHERE "
//                + "date BETWEEN '" + startDate + "' AND '" + endDate + "' "
//                + "AND user_id = '" + userId + "' " // Filter by userId
//                + "GROUP BY "
//                + "date) k "
//                + "ON "
//                + "p.date = k.date "
//                + "LEFT JOIN "
//                + "(SELECT "
//                + "date, type, "
//                + "quantity AS petrol_quantity, "
//                + "total AS petrol_total, "
//                + "vat AS petrol_vat, "
//                + "cess AS petrol_cess, "
//                + "jtcpercentage AS petrol_jtcpercentage, "
//                + "total_purchase AS petrol_total_purchase "
//                + "FROM "
//                + "managment.purchase "
//                + "WHERE "
//                + "type = 'petrol' AND user_id = '" + userId + "') pp " // Filter by userId
//                + "ON "
//                + "p.date = pp.date "
//                + "LEFT JOIN "
//                + "(SELECT "
//                + "date, "
//                + "SUM(amount) AS Amount_Total "
//                + "FROM "
//                + "managment.transaction "
//                + "WHERE "
//                + "date BETWEEN '" + startDate + "' AND '" + endDate + "' "
//                + "AND user_id = '" + userId + "' " // Filter by userId
//                + "GROUP BY "
//                + "date) t "
//                + "ON "
//                + "p.date = t.date "
//                + "LEFT JOIN "
//                + "(SELECT "
//                + "date, type, "
//                + "quantity AS diesel_quantity, "
//                + "total AS diesel_total, "
//                + "vat AS diesel_vat, "
//                + "cess AS diesel_cess, "
//                + "jtcpercentage AS diesel_jtcpercentage, "
//                + "total_purchase AS diesel_total_purchase "
//                + "FROM "
//                + "managment.purchase "
//                + "WHERE "
//                + "type = 'diesel'  AND user_id = '" + userId + "') dp " // Filter by userId
//                + "ON "
//                + "d.date = dp.date "
//                + "LEFT JOIN "
//                + "(SELECT "
//                + "date, "
//                + "SUM(jama) AS Jama_Total, "
//                + "SUM(baki) AS Baki_Total "
//                + "FROM "
//                + "managment.jamabakireport "
//                + "WHERE "
//                + "date BETWEEN '" + startDate + "' AND '" + endDate + "' "
//                + "AND user_id = '" + userId + "' " // Filter by userId
//                + "GROUP BY "
//                + "date) j "
//                + "ON "
//                + " p.date = j.date "
//                + "ORDER BY "
//                + "p.date;";
//
//        return jdbcTemplate.queryForList(sql);
//    }

    @GetMapping(value = "/userList")
    public List<DAOUser> getAllUser() {
        List<DAOUser> userlist = userRepository.findAll();
        return userlist;
    }

    private double safeSum(List<?> list) {
        return list.stream()
                .filter(Objects::nonNull)
                .mapToDouble(val -> {
                    if (val instanceof String) {
                        return Double.parseDouble((String) val);
                    }
                    if (val instanceof Number) {
                        return ((Number) val).doubleValue();
                    }
                    return 0.0;
                }).sum();
    }

    @GetMapping("/oneDayAgoUgadtoStock")
    public Map<String, Object> getOneDayAgoUgadtoStock(@RequestParam String date, @RequestParam String userId) {
        Map<String, Object> response = new HashMap<>();
        List<Dailystock> petrol = dailyskockRepository.findDataForOneDayAgo(date, userId);
        List<dailydieselstock> diesel = dailydieselstockRepository.findDataForOneDayAgo(date, userId);
        Dailystock petrolData = petrol.isEmpty() ? null : petrol.get(0);
        dailydieselstock dieselData = diesel.isEmpty() ? null : diesel.get(0);

        response.put("petrol", petrolData != null ? petrolData.getOpenstock() : null);
        response.put("diesel", dieselData != null ? dieselData.getDieselopenstock() : null);
        return response;
    }

    @GetMapping(value = "/OilList")
    public List<OilSell> getOilsell(@RequestParam String date, @RequestParam String userId) {
        List<OilSell> rawData = oilSellRepository.getoilData(date, userId);
        return rawData;
    }

    @GetMapping(value = "/transaction")
    public List<transaction> getTransaction(@RequestParam String date, @RequestParam String userId) {
        List<transaction> transaction = transactionRepository.gettransation(date, userId);
        return transaction;
    }

    @GetMapping(value = "/kharch")
    public List<kharch> getkharch(@RequestParam String date, @RequestParam String userId) {
        List<kharch> kharch = kharchrepository.getkharch(date, userId);
        return kharch;
    }

    @GetMapping(value = "/jamabaki")
    public List<jamabaki> getjamabaki(@RequestParam String date, @RequestParam String userId) {
        List<jamabaki> jamabaki = JamabakiRepository.getjamabaki(date, userId);
        return jamabaki;
    }

    @GetMapping(value = "/purchase")
    public List<Purchase> getPurchase(@RequestParam String date, @RequestParam String userId) {
        List<Purchase> purchase = purchaseRepository.getPurchase(date, userId);
        return purchase;
    }

    @GetMapping(value = "/dip")
    public List<DipStock> getDip(@RequestParam String date, @RequestParam String userId) {
        List<DipStock> dip = dipStockRepository.getDipData(date, userId);
        return dip;
    }

    //    @PostMapping("/saveFuelReport")
//    public ResponseEntity<String> saveFuelData(@RequestBody Map<String, Object> payload) {
//        List<Map<String, Object>> petrolData = (List<Map<String, Object>>) payload.get("petrolInputData");
//        List<Map<String, Object>> dieselData = (List<Map<String, Object>>) payload.get("dieselInputData");
//
//        try {
//            // Save Petrol Data
//            List<PetrolSell> petrolEntities = petrolData.stream()
//                    .map(data -> {
//                        PetrolSell petrol = new PetrolSell();
//                        petrol.setDate((String) data.get("date"));
//                        petrol.setUserId((String) data.get("user_id"));
//                        petrol.setPump((String) data.get("pump"));
//                        petrol.setOpen_meter((String) data.get("open_meter"));
//                        petrol.setClose_meter((String) data.get("close_meter"));
//                        petrol.setTesting((String) data.get("testing"));
//                        petrol.setRate((String) data.get("rate"));
//                        petrol.setTotal((String) data.get("total"));
//                        petrol.setTotal_sell((String) data.get("total_sell"));
//                        petrol.setPetrol_ltr((String) data.get("petrol_ltr"));
//                        return petrol;
//                    })
//                    .collect(Collectors.toList());
//            petrolSellRepository.saveAll(petrolEntities);
//
//            // Save Diesel Data
//            List<Dieselsell> dieselEntities = dieselData.stream()
//                    .map(data -> {
//                        Dieselsell diesel = new Dieselsell();
//                        diesel.setDate((String) data.get("date"));
//                        diesel.setUserId((String) data.get("user_id"));
//                        diesel.setPump((String) data.get("pump"));
//                        diesel.setOpen_meter((String) data.get("open_meter"));
//                        diesel.setClose_meter((String) data.get("close_meter"));
//                        diesel.setTesting((String) data.get("testing"));
//                        diesel.setRate((String) data.get("rate"));
//                        diesel.setTotal((String) data.get("total"));
//                        diesel.setTotal_sell((String) data.get("total_sell"));
//                        diesel.setDiesel_ltr((String) data.get("diesel_ltr"));
//                        return diesel;
//                    })
//                    .collect(Collectors.toList());
//            dieselSellRepository.saveAll(dieselEntities);
//
//            return ResponseEntity.ok("Data saved successfully!");
//        } catch (Exception e) {
//                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body("Failed to save fuel data: " + e.getMessage());
//        }
//    }
    @PostMapping("/saveFuelReport")
    public ResponseEntity<ApiResponse> saveFuelData(@RequestBody Map<String, Object> payload) {
        List<Map<String, Object>> petrolData = (List<Map<String, Object>>) payload.get("petrolInputData");
        List<Map<String, Object>> dieselData = (List<Map<String, Object>>) payload.get("dieselInputData");

        if (petrolData.isEmpty() && dieselData.isEmpty()) {
            ApiResponse response = new ApiResponse("No data to save.");
            return ResponseEntity.ok(response);
        }

        try {
            // 🚀 **Save or Update Petrol Data**
            List<PetrolSell> petrolEntities = petrolData.stream()
                    .map(data -> {
                        String date = (String) data.get("date");
                        String userId = (String) data.get("user_id");
                        String pump = (String) data.get("pump");
                        Optional<PetrolSell> existingPetrol = petrolSellRepository.findByDateAndPumpAndUserId(date, pump, userId);

                        PetrolSell petrol;
                        if (existingPetrol.isPresent()) {
                            petrol = existingPetrol.get();
                            // If present, update values
                            petrol.setOpen_meter((String) data.get("open_meter"));
                            petrol.setClose_meter((String) data.get("close_meter"));
                            petrol.setTesting((String) data.get("testing"));
                            petrol.setRate((String) data.get("rate"));
                            petrol.setTotal((String) data.get("total"));
                            petrol.setTotal_sell((String) data.get("total_sell"));
                            petrol.setPetrol_ltr((String) data.get("petrol_ltr"));
                        } else {
                            petrol = new PetrolSell();
                            petrol.setDate(date);
                            petrol.setUserId(userId);
                            petrol.setPump(pump);
                            petrol.setOpen_meter((String) data.get("open_meter"));
                            petrol.setClose_meter((String) data.get("close_meter"));
                            petrol.setTesting((String) data.get("testing"));
                            petrol.setRate((String) data.get("rate"));
                            petrol.setTotal((String) data.get("total"));
                            petrol.setTotal_sell((String) data.get("total_sell"));
                            petrol.setPetrol_ltr((String) data.get("petrol_ltr"));
                        }
                        return petrol;
                    })
                    .collect(Collectors.toList());
            petrolSellRepository.saveAll(petrolEntities);

            // 🚀 **Save or Update Diesel Data**
            List<Dieselsell> dieselEntities = dieselData.stream()
                    .map(data -> {
                        String date = (String) data.get("date");
                        String userId = (String) data.get("user_id");
                        String pump = (String) data.get("pump");

                        // 🔍 Check if data already exists for date and pump
                        Optional<Dieselsell> existingDiesel = dieselSellRepository.findByDateAndPumpAndUserId(date, pump, userId);

                        Dieselsell diesel;
                        if (existingDiesel.isPresent()) {
                            diesel = existingDiesel.get();
                            // If present, update values
                            diesel.setOpen_meter((String) data.get("open_meter"));
                            diesel.setClose_meter((String) data.get("close_meter"));
                            diesel.setTesting((String) data.get("testing"));
                            diesel.setRate((String) data.get("rate"));
                            diesel.setTotal((String) data.get("total"));
                            diesel.setTotal_sell((String) data.get("total_sell"));
                            diesel.setDiesel_ltr((String) data.get("diesel_ltr"));
                        } else {
                            // If not present, create new
                            diesel = new Dieselsell();
                            diesel.setDate(date);
                            diesel.setUserId(userId);
                            diesel.setPump(pump);
                            diesel.setOpen_meter((String) data.get("open_meter"));
                            diesel.setClose_meter((String) data.get("close_meter"));
                            diesel.setTesting((String) data.get("testing"));
                            diesel.setRate((String) data.get("rate"));
                            diesel.setTotal((String) data.get("total"));
                            diesel.setTotal_sell((String) data.get("total_sell"));
                            diesel.setDiesel_ltr((String) data.get("diesel_ltr"));
                        }
                        return diesel;
                    })
                    .collect(Collectors.toList());
            dieselSellRepository.saveAll(dieselEntities);

            ApiResponse response = new ApiResponse("Data saved/updated successfully!");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse("Failed to save fuel data: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/saveXPPowerReport")
    public ResponseEntity<ApiResponse> saveXPPowerData(@RequestBody Map<String, Object> payload) {
        List<Map<String, Object>> xpPetrol = (List<Map<String, Object>>) payload.get("XppetrolInputData");
        List<Map<String, Object>> powerdiesel = (List<Map<String, Object>>) payload.get("powerDieselInputData");

        if (xpPetrol.isEmpty() && powerdiesel.isEmpty()) {
            ApiResponse response = new ApiResponse("No data to save.");
            return ResponseEntity.ok(response);
        }

        try {
            // 🚀 **Save or Update Petrol Data**
            List<xpPetrol> xppetrolEntities = xpPetrol.stream()
                    .map(data -> {
                        String date = (String) data.get("date");
                        String userId = (String) data.get("user_id");
                        String pump = (String) data.get("pump");
                        Optional<xpPetrol> existingPetrol = xpPetorlRepository.findByDateAndPumpAndUserId(date, pump, userId);

                        xpPetrol xp;
                        if (existingPetrol.isPresent()) {
                            xp = existingPetrol.get();
                            // If present, update values
                            xp.setOpen_meter((String) data.get("open_meter"));
                            xp.setClose_meter((String) data.get("close_meter"));
                            xp.setTesting((String) data.get("testing"));
                            xp.setRate((String) data.get("rate"));
                            xp.setTotal((String) data.get("total"));
                            xp.setTotal_sell((String) data.get("total_sell"));
                            xp.setXppetrol_ltr((String) data.get("xppetrol_ltr"));
                        } else {
                            xp = new xpPetrol();
                            xp.setDate(date);
                            xp.setUserId(userId);
                            xp.setPump(pump);
                            xp.setOpen_meter((String) data.get("open_meter"));
                            xp.setClose_meter((String) data.get("close_meter"));
                            xp.setTesting((String) data.get("testing"));
                            xp.setRate((String) data.get("rate"));
                            xp.setTotal((String) data.get("total"));
                            xp.setTotal_sell((String) data.get("total_sell"));
                            xp.setXppetrol_ltr((String) data.get("xppetrol_ltr"));
                        }
                        return xp;
                    })
                    .collect(Collectors.toList());
            xpPetorlRepository.saveAll(xppetrolEntities);

            // 🚀 **Save or Update Diesel Data**
            List<powerDiesel> powerdieselEntities = powerdiesel.stream()
                    .map(data -> {
                        String date = (String) data.get("date");
                        String userId = (String) data.get("user_id");
                        String pump = (String) data.get("pump");

                        // 🔍 Check if data already exists for date and pump
                        Optional<powerDiesel> existingDiesel = powerDieselRepository.findByDateAndPumpAndUserId(date, pump, userId);

                        powerDiesel power;
                        if (existingDiesel.isPresent()) {
                            power = existingDiesel.get();
                            // If present, update values
                            power.setOpen_meter((String) data.get("open_meter"));
                            power.setClose_meter((String) data.get("close_meter"));
                            power.setTesting((String) data.get("testing"));
                            power.setRate((String) data.get("rate"));
                            power.setTotal((String) data.get("total"));
                            power.setTotal_sell((String) data.get("total_sell"));
                            power.setPowerdiesel_ltr((String) data.get("powerdiesel_ltr"));
                        } else {
                            // If not present, create new
                            power = new powerDiesel();
                            power.setDate(date);
                            power.setUserId(userId);
                            power.setPump(pump);
                            power.setOpen_meter((String) data.get("open_meter"));
                            power.setClose_meter((String) data.get("close_meter"));
                            power.setTesting((String) data.get("testing"));
                            power.setRate((String) data.get("rate"));
                            power.setTotal((String) data.get("total"));
                            power.setTotal_sell((String) data.get("total_sell"));
                            power.setPowerdiesel_ltr((String) data.get("powerdiesel_ltr"));
                        }
                        return power;
                    })
                    .collect(Collectors.toList());
            powerDieselRepository.saveAll(powerdieselEntities);

            ApiResponse response = new ApiResponse("Data saved/updated successfully!");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse("Failed to save fuel data: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    //PETROL SELL
    @GetMapping(value = "/petrolList")
    public List<PetrolSell> getPetrolSell(@RequestParam String date, @RequestParam String userId) {
        List<PetrolSell> petrol = petrolSellRepository.findByDateAndUserId(date, userId);
        return petrol;
    }

    @GetMapping(value = "/dieselList")
    public List<Dieselsell> getDieselSell(@RequestParam String date, @RequestParam String userId) {
        List<Dieselsell> Diesel = dieselSellRepository.findByDateAndUserId(date, userId);
        return Diesel;
    }

    @GetMapping(value = "/userName")
    public ResponseEntity<ApiResponse> getUserName(@RequestParam Long userId) {
        String userName = userRepository.getUserDataForDate(userId);

        if (userName != null) {
            return ResponseEntity.ok(new ApiResponse(userName));
        } else {
            return ResponseEntity.ok(new ApiResponse("User not found"));
        }
    }

    @GetMapping(value = "/userPump")
   public ResponseEntity<ApiResponse> getUserPump(@RequestParam Long userId) {
    Object[] result = userRepository.getUserPump(userId);

    if (result != null && result.length > 0 && result[0] instanceof Object[]) {
        Object[] inner = (Object[]) result[0];

        if (inner.length == 4) {
            Map<String, String> userPumpData = new HashMap<>();
            userPumpData.put("petrol_nozzle", String.valueOf(inner[0]));
            userPumpData.put("diesel_nozzle", String.valueOf(inner[1]));
            userPumpData.put("xp_petrol_nozzle", String.valueOf(inner[2]));
            userPumpData.put("powe_diesel_nozzle", String.valueOf(inner[3]));

            return ResponseEntity.ok(new ApiResponse(true, "Pump data loaded successfully", userPumpData));
        }
    }

    return ResponseEntity.ok(new ApiResponse("User not found or incomplete data"));
}

    @PostMapping(value = "/totalPetrolStock")
    public ResponseEntity<ApiResponse> saveOrUpdateTotalPetrolStock(@RequestBody PetrolStockRequest request) {
        String userId = request.getUserId();
        String date = request.getDate();
        double minP = request.getPetrolRemaining();

        if (dailyskockRepository.countByDate(date, userId) == 0) {
            dailyskockRepository.insertDailyStock(date, minP, userId);
            return ResponseEntity.ok(new ApiResponse("Petrol stock saved successfully."));
        } else {
            dailyskockRepository.updateDailyStock(date, minP, userId); // New update method
            return ResponseEntity.ok(new ApiResponse("Petrol stock updated successfully."));
        }
    }

    @PostMapping(value = "/totalDieselStock")
    public ResponseEntity<ApiResponse> saveOrUpdateDieselStock(@RequestBody DieselStockRequest request) {
        String userId = request.getUserId();
        String date = request.getDate();
        double minP = request.getDieselRemaining();
        if (dailydieselstockRepository.countByDate(date, userId) == 0) {
            dailydieselstockRepository.insertDailydieselstock(date, minP, userId);
            System.out.println("Diesel stock saved for date " + date);
            return ResponseEntity.ok(new ApiResponse("Diesel stock saved successfully."));
        } else {
            dailydieselstockRepository.updateDailydieselstock(date, minP, userId);
            System.out.println("Diesel stock updated for date " + date);
            return ResponseEntity.ok(new ApiResponse("Diesel stock updated successfully."));
        }
    }

    @PostMapping(value = "/totalCase")
    public ResponseEntity<ApiResponse> saveTotalCase(@RequestBody TotalCaseRequest request) {
        String userId = request.getUserId();
        String date = request.getDate();
        double totalcase = request.getTotalcase();

        List<dailytotal> existingRecords = DailytotalRepository.findByDateAndUserId(date, userId);

        if (existingRecords.isEmpty()) {
            dailytotal dailyTotal = new dailytotal();
            dailyTotal.setDate(date);
            dailyTotal.setDailyTotal(totalcase);
            dailyTotal.setUserId(userId);
            DailytotalRepository.save(dailyTotal);
            return ResponseEntity.ok(new ApiResponse("Data saved successfully."));
        } else {
            dailytotal recordToUpdate = existingRecords.get(0);
            recordToUpdate.setDailyTotal(totalcase);
            DailytotalRepository.save(recordToUpdate);
            return ResponseEntity.ok(new ApiResponse("Data updated successfully."));
        }
    }

    @PostMapping("/moneyDetails")
    public ResponseEntity<ApiResponse> saveOrUpdateMoneyDetails(@RequestBody MoneyDetailsDto dto) {
        try {
            moneyDetails moneyDetails = MoneyDetailsRepository.findByDate(dto.getDate()).orElse(new moneyDetails());
            moneyDetails.setNote(dto.getNote());
            moneyDetails.setUserId(dto.getUserId());
            moneyDetails.setDate(dto.getDate());
            moneyDetails.setTotalCase(dto.getTotalCaseCase());
            moneyDetails.setTwothousand(0);
            moneyDetails.setFivehundred(0);
            moneyDetails.setTwohundred(0);
            moneyDetails.setOnehundred(0);
            moneyDetails.setFifty(0);
            moneyDetails.setTwenty(0);
            moneyDetails.setTen(0);
            for (MoneyDetailsDto.Denomination denomination : dto.getDenominations()) {
                if (denomination.getTotal().equals(denomination.getCount() * getValue(denomination.getValue()))) {
                    switch (denomination.getValue()) {
                        case "twothousand":
                            moneyDetails.setTwothousand(denomination.getCount());
                            break;
                        case "fivehundred":
                            moneyDetails.setFivehundred(denomination.getCount());
                            break;
                        case "twohundred":
                            moneyDetails.setTwohundred(denomination.getCount());
                            break;
                        case "onehundred":
                            moneyDetails.setOnehundred(denomination.getCount());
                            break;
                        case "fifty":
                            moneyDetails.setFifty(denomination.getCount());
                            break;
                        case "twenty":
                            moneyDetails.setTwenty(denomination.getCount());
                            break;
                        case "ten":
                            moneyDetails.setTen(denomination.getCount());
                            break;
                        default:
                            throw new IllegalArgumentException("Invalid denomination: " + denomination.getValue());
                    }
                } else {
                    throw new IllegalArgumentException("❌ Total amount does not match value * count for " + denomination.getValue());
                }
            }

            MoneyDetailsRepository.save(moneyDetails);
            String message = moneyDetails.getId() == null ? "Data added successfully" : "Data updated successfully";
            return ResponseEntity.ok(new ApiResponse("✅ " + message));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse("❌ Error saving data: " + e.getMessage()));
        }
    }

    private int getValue(String denomination) {
        switch (denomination) {
            case "twothousand":
                return 2000;
            case "fivehundred":
                return 500;
            case "twohundred":
                return 200;
            case "onehundred":
                return 100;
            case "fifty":
                return 50;
            case "twenty":
                return 20;
            case "ten":
                return 10;
            default:
                throw new IllegalArgumentException("Invalid denomination: " + denomination);
        }
    }

    @GetMapping(value = "/moneyDetailsList")
    public List<moneyDetails> getmoneyDetailsList(@RequestParam String date, @RequestParam String userId) {
        List<moneyDetails> moneyDetails = MoneyDetailsRepository.findByDateAndUserId(date, userId);
        return moneyDetails;
    }

    @GetMapping(value = "/expenseslist")
    public List<Expenses> getexpenseslist() {
        List<Expenses> expenses = expensesRepository.findAll();
        return expenses;
    }

    @PostMapping(value = "/addexpenses")
    public ResponseEntity<ApiResponse> saveExpense(@RequestBody Expenses expense) {
        expensesRepository.save(expense);
        return ResponseEntity.ok(new ApiResponse("Data saved successfully."));
    }

    @GetMapping(value = "/oillist")
    public List<OilsellList> getoillist() {
        List<OilsellList> oillist = oilsellListRepository.findAll();
        return oillist;
    }

    @GetMapping("/expensesExcel")
    public List<kharch> getExpenses(
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate,
            @RequestParam("expense") String expense,
            @RequestParam("userId") String userId) {
        return kharchrepository.findByDateBetweenAndExpensesLikeAndUserId(startDate, endDate, expense, userId);
    }

    @GetMapping(value = "/XPpetrolList")
    public List<xpPetrol> getXPPetrol(@RequestParam String date, @RequestParam String userId) {
        List<xpPetrol> xpPetrol = xpPetorlRepository.findByDateAndUserId(date, userId);
        return xpPetrol;
    }

    @GetMapping(value = "/powerDiesel")
    public List<powerDiesel> getpowerDiesel(@RequestParam String date, @RequestParam String userId) {
        List<powerDiesel> powerDiesel = powerDieselRepository.findByDateAndUserId(date, userId);
        return powerDiesel;
    }
//    private List<Map<String, Object>> queryThis(String startDate, String endDate, String userId) {
//        String sql = "SELECT "
//                + "p.date, "
//                + "COALESCE(p.total_close_meter, 0) AS petrol_total_close_meter, "
//                + "COALESCE(p.total_open_meter, 0) AS petrol_total_open_meter, "
//                + "COALESCE(p.total_sum, 0) AS petrol_total_sum, "
//                + "COALESCE(p.total_testing, 0) AS petrol_total_testing, "
//                + "COALESCE(p.petrol_ltr, 0) AS petrol_ltr, "
//                + "COALESCE(p.rate, 0) AS petrol_rate, "
//                + "COALESCE(p.total_total_sell, 0) AS petrol_total_total_sell, "
//                + "COALESCE(d.total_close_meter, 0) AS diesel_total_close_meter, "
//                + "COALESCE(d.total_open_meter, 0) AS diesel_total_open_meter, "
//                + "COALESCE(d.total_sum, 0) AS diesel_total_sum, "
//                + "COALESCE(d.total_testing, 0) AS diesel_total_testing, "
//                + "COALESCE(d.diesel_ltr, 0) AS diesel_ltr, "
//                + "COALESCE(d.rate, 0) AS diesel_rate, "
//                + "COALESCE(d.total_total_sell, 0) AS diesel_total_total_sell, "
//                + "COALESCE(o.total_price, 0) AS oil_total_price, "
//                + "COALESCE(k.Kharch_Total, 0) AS Kharch_Total, "
//                + "COALESCE(pp.type, 0) AS PType, "
//                + "COALESCE(pp.petrol_quantity, 0) AS Petrol_Quantity, "
//                + "COALESCE(pp.petrol_total, 0) AS Petrol_Total, "
//                + "COALESCE(pp.petrol_vat, 0) AS Petrol_Vat, "
//                + "COALESCE(pp.petrol_cess, 0) AS Petrol_Cess, "
//                + "COALESCE(pp.petrol_jtcpercentage, 0) AS Petrol_Jtcpercentage, "
//                + "COALESCE(pp.petrol_total_purchase, 0) AS Petrol_Total_Purchase, "
//                + "COALESCE(dp.type, 0) AS DType, "
//                + "COALESCE(dp.diesel_quantity, 0) AS Diesel_Quantity, "
//                + "COALESCE(dp.diesel_total, 0) AS Diesel_Total, "
//                + "COALESCE(dp.diesel_vat, 0) AS Diesel_Vat, "
//                + "COALESCE(dp.diesel_cess, 0) AS Diesel_Cess, "
//                + "COALESCE(dp.diesel_jtcpercentage, 0) AS Diesel_Jtcpercentage, "
//                + "COALESCE(dp.diesel_total_purchase, 0) AS Diesel_Total_Purchase, "
//                + "COALESCE(t.Amount_Total, 0) AS Amount_Total, "
//                + "COALESCE(j.Jama_Total, 0) AS Jama_Total, "
//                + "COALESCE(j.Baki_Total, 0) AS Baki_Total "
//                + "FROM "
//                + "(SELECT "
//                + "date, "
//                + "SUM(close_meter) AS total_close_meter, "
//                + "SUM(open_meter) AS total_open_meter, "
//                + "SUM(total) AS total_sum, "
//                + "SUM(testing) AS total_testing, "
//                + "SUM(petrol_ltr) AS petrol_ltr, "
//                + "rate, "
//                + "SUM(total_sell) AS total_total_sell "
//                + "FROM "
//                + "managment.petrolsell "
//                + "WHERE "
//                + "date BETWEEN '" + startDate + "' AND '" + endDate + "' "
//                + "GROUP BY "
//                + "date, rate) p "
//                + "JOIN "
//                + "(SELECT "
//                + "date, "
//                + "SUM(close_meter) AS total_close_meter, "
//                + "SUM(open_meter) AS total_open_meter, "
//                + "SUM(total) AS total_sum, "
//                + "SUM(testing) AS total_testing, "
//                + "SUM(diesel_ltr) AS diesel_ltr, "
//                + "rate, "
//                + "SUM(total_sell) AS total_total_sell "
//                + "FROM "
//                + "managment.dieselsell "
//                + "WHERE "
//                + "date BETWEEN  '" + startDate + "' AND '" + endDate + "' "
//                + "GROUP BY "
//                + "date, rate) d "
//                + "ON "
//                + "p.date = d.date "
//                + "LEFT JOIN "
//                + "(SELECT "
//                + "date, "
//                + "SUM(price) AS total_price "
//                + "FROM "
//                + "managment.OilSell "
//                + "WHERE "
//                + "date BETWEEN  '" + startDate + "' AND '" + endDate + "' "
//                + "GROUP BY "
//                + "date) o "
//                + "ON "
//                + "p.date = o.date "
//                + "LEFT JOIN "
//                + "(SELECT "
//                + "date, "
//                + "SUM(price) AS Kharch_Total "
//                + "FROM "
//                + "managment.kharch "
//                + "WHERE "
//                + "date BETWEEN '" + startDate + "' AND '" + endDate + "' "
//                + "GROUP BY "
//                + "date) k "
//                + "ON "
//                + "p.date = k.date "
//                + "LEFT JOIN "
//                + "(SELECT "
//                + "date, type, "
//                + "quantity AS petrol_quantity, "
//                + "total AS petrol_total, "
//                + "vat AS petrol_vat, "
//                + "cess AS petrol_cess, "
//                + "jtcpercentage AS petrol_jtcpercentage, "
//                + "total_purchase AS petrol_total_purchase "
//                + "FROM "
//                + "managment.purchase "
//                + "WHERE "
//                + "type = 'petrol') pp "
//                + "ON "
//                + "p.date = pp.date "
//                + "LEFT JOIN "
//                + "(SELECT "
//                + "date, "
//                + "SUM(amount) AS Amount_Total "
//                + "FROM "
//                + "managment.transaction "
//                + "WHERE "
//                + "date BETWEEN '" + startDate + "' AND '" + endDate + "' "
//                + "GROUP BY "
//                + "date) t "
//                + "ON "
//                + "p.date = t.date "
//                + "LEFT JOIN "
//                + "(SELECT "
//                + "date, type, "
//                + "quantity AS diesel_quantity, "
//                + "total AS diesel_total, "
//                + "vat AS diesel_vat, "
//                + "cess AS diesel_cess, "
//                + "jtcpercentage AS diesel_jtcpercentage, "
//                + "total_purchase AS diesel_total_purchase "
//                + "FROM "
//                + "managment.purchase "
//                + "WHERE "
//                + "type = 'diesel') dp "
//                + "ON "
//                + "d.date = dp.date "
//                + "LEFT JOIN "
//                + "(SELECT "
//                + "date, "
//                + "SUM(jama) AS Jama_Total, "
//                + "SUM(baki) AS Baki_Total "
//                + "FROM "
//                + "managment.jamabakireport "
//                + "WHERE "
//                + "date BETWEEN '" + startDate + "' AND '" + endDate + "' "
//                + "GROUP BY "
//                + "date) j "
//                + "ON "
//                + " p.date = j.date "
//                + "ORDER BY "
//                + "p.date;";
//        return jdbcTemplate.queryForList(sql);
//    }
}
//    @GetMapping("/jamabaki/senderPump")
//    public List<Map<String, Object>> getSumAmountAndDateBySenderPump() throws java.text.ParseException {
//        List<Object[]> result = JamabakiRepository.sumAmountAndDateBySenderContainingIgnoreCase("Pump");
//
//        List<Map<String, Object>> response = new ArrayList<>();
//
//        SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd"); // Adjust the pattern based on your actual date format
//        SimpleDateFormat outputFormat = new SimpleDateFormat("dd/MM/yyyy");
//
//        for (Object[] row : result) {
//            Map<String, Object> entry = new HashMap<>();
//            // Assuming the date is stored in the first column as a string
//            String dateString = (String) row[0];
//            // Parse the date string into a Date object
//            Date date = inputFormat.parse(dateString);
//            // Format the date using the output format
//            String formattedDate = outputFormat.format(date);
//            entry.put("date", formattedDate);
//            entry.put("sum", row[1]); // Assuming the sum of amounts is stored in the second column
//            response.add(entry);
//        }
//        return null;

//        List<Object[]> result = JamabakiRepository.sumAmountAndDateByReceiverContainingIgnoreCase("Pump");
// Prepare a list to hold the results
//        List<Map<String, Object>> response = new ArrayList<>();
//        SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd");
//        SimpleDateFormat outputFormat = new SimpleDateFormat("dd/MM/yyyy");
// Iterate through the fetched data
//        for (Object[] row : result) {
//            Map<String, Object> entry = new HashMap<>();
//            // Assuming the date is stored in the first column as a string
//            String dateString = (String) row[0];
//            // Parse the date string into a Date object
//            Date date = inputFormat.parse(dateString);
//            // Format the date using the output format
//            String formattedDate = outputFormat.format(date);
//            entry.put("date", formattedDate);
//            entry.put("sum", row[1]); // Assuming the sum of amounts is stored in the second column
//            response.add(entry);
//        }
//        return response;
//    }
//    @GetMapping("/expenses-and-notes")
//    public List<Object[]> getExpensesAndNotes() {
//        return kharchrepository.findExpensesAndNotes();
//    }
//    @GetMapping("/ShowCutomerjamabaki/{name}")
//    public List<jamabaki> getReportsByName(@RequestParam String name) {
//        return JamabakiRepository.findByCompanyName(name);
//    }
//    details
//    @GetMapping("/combined-sell-summary")
//    public SellSummaryDTO getCombinedSellSummary(@RequestParam String startDate, @RequestParam String endDate) {
//        SellSummaryDTO sellSummaryDTO = new SellSummaryDTO();
//
//        sellSummaryDTO.setPetrolSellSummary(petrolSellRepository.findPetrolSellSummaryBetweenDates(startDate, endDate));
//        sellSummaryDTO.setDieselSellSummary(dieselSellRepository.findDieselSellSummaryBetweenDates(startDate, endDate));
//        sellSummaryDTO.setOilSellSummary(oilSellRepository.findOilSellSummaryBetweenDates(startDate, endDate));
//        sellSummaryDTO.setKharchSellSummary(kharchrepository.findKharchSellSummaryBetweenDates(startDate, endDate));
//        sellSummaryDTO.setTransactionSellSummary(transactionRepository.findTransactionSellSummaryBetweenDates(startDate, endDate));
//        sellSummaryDTO.setPurchaseSummary(purchaseRepository.findPurchasesBetweenDates(startDate, endDate));
//
//        return sellSummaryDTO;
//    }
//    @GetMapping("/Daily")
//    public DailySalesSummaryDTO getSalesReport() {
//        String sql = """
//                SELECT
//                    p.date,
//                    p.PetrolSell_Total,
//                    d.DieselSell_Total,
//                    o.OilSell_Total,
//                    k.Kharch_Total,
//                    t.Atm_total,
//                    j.Jama_Total,
//                    j.baki_Total,
//                    purchase.total_petrol_purchase,
//                    purchase.total_diesel_purchase
//                FROM
//                    (SELECT date, SUM(total_sell) AS PetrolSell_Total FROM managment.petrolsell WHERE date = CURDATE()) p
//                JOIN
//                    (SELECT date, SUM(total_sell) AS DieselSell_Total FROM managment.dieselsell WHERE date = CURDATE()) d ON p.date = d.date
//                JOIN
//                    (SELECT date, SUM(price) AS OilSell_Total FROM managment.oilsell WHERE date = CURDATE()) o ON p.date = o.date
//                JOIN
//                    (SELECT date, SUM(price) AS Kharch_Total FROM managment.kharch WHERE date = CURDATE()) k ON p.date = k.date
//                JOIN
//                    (SELECT date, SUM(amount) AS Atm_total FROM managment.transaction WHERE date = CURDATE()) t ON p.date = t.date
//                JOIN
//                    (SELECT date, SUM(jama) AS Jama_Total, SUM(baki) AS baki_Total FROM managment.jamabakireport WHERE date = CURDATE()) j ON p.date = j.date
//                LEFT JOIN
//                    (SELECT
//                        date,
//                        SUM(CASE WHEN type = 'petrol' THEN total_purchase ELSE 0 END) AS total_petrol_purchase,
//                        SUM(CASE WHEN type = 'diesel' THEN total_purchase ELSE 0 END) AS total_diesel_purchase
//                     FROM
//                        managment.purchase
//                     WHERE
//                        date = CURDATE()
//                     GROUP BY
//                        date
//                    ) purchase ON p.date = purchase.date;
//                """;
//        return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
//            DailySalesSummaryDTO salesSummary = new DailySalesSummaryDTO();
//            salesSummary.setDate(rs.getDate("date").toString());
//            salesSummary.setPetrolSellTotal(rs.getDouble("PetrolSell_Total"));
//            salesSummary.setDieselSellTotal(rs.getDouble("DieselSell_Total"));
//            salesSummary.setOilSellTotal(rs.getDouble("OilSell_Total"));
//            salesSummary.setKharchTotal(rs.getDouble("Kharch_Total"));
//            salesSummary.setAtmTotal(rs.getDouble("Atm_total"));
//            salesSummary.setJamaTotal(rs.getDouble("Jama_Total"));
//            salesSummary.setBakiTotal(rs.getDouble("baki_Total"));
//            salesSummary.setTotalPetrolPurchase(rs.getDouble("total_petrol_purchase"));
//            salesSummary.setTotalDieselPurchase(rs.getDouble("total_diesel_purchase"));
//            return salesSummary;
//        });
//    }
//    @GetMapping(value = "/itreturn", produces = MediaType.APPLICATION_PDF_VALUE)
//    public ResponseEntity<byte[]> getItReturn(
//            @RequestParam("startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") String startDate,
//            @RequestParam("endDate") @DateTimeFormat(pattern = "yyyy-MM-dd") String endDate) throws IOException, JRException, java.text.ParseException {
//        byte[] reportBytes = generateReportItReport(startDate, endDate); // Pass both dates to generateReportItReport
//        return ResponseEntity.ok().contentType(MediaType.APPLICATION_PDF).body(reportBytes);
//    }
//
//    private byte[] generateReportItReport(String startDate, String endDate) throws IOException, JRException, java.text.ParseException {
//        ByteArrayOutputStream outputStream = null;
//        try {
//            // Load the Jasper report from the specified path
//            JasperReport jasperReport = (JasperReport) JRLoader.loadObjectFromFile("D:/ItReturn.jasper");
//
//            // Parse and format the start date
//            SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd");
//            Date parsedStartDate = inputFormat.parse(startDate);
//            SimpleDateFormat outputFormat = new SimpleDateFormat("dd/MM/yyyy");
//            String formattedStartDate = outputFormat.format(parsedStartDate);
//
//            // Parse and format the end date
//            Date parsedEndDate = inputFormat.parse(endDate);
//            String formattedEndDate = outputFormat.format(parsedEndDate);
//
//            // Prepare parameters to pass to the Jasper report
//            Map<String, Object> parameters = new HashMap<>();
//            parameters.put("date", formattedStartDate); // This will be your start date parameter
//            parameters.put("date2", formattedEndDate); // This will be your end date parameter
//
//            // Fill the Jasper report with parameters and an empty data source
//            JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, new JREmptyDataSource());
//
//            // Export the filled report to a PDF stream
//            outputStream = new ByteArrayOutputStream();
//            JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);
//        } catch (JRException | java.text.ParseException ex) {
//            ex.printStackTrace(); // Handle exceptions appropriately
//        }
//
//        // Return the generated PDF as a byte array
//        return outputStream != null ? outputStream.toByteArray() : new byte[0];
//    }
//    @PostMapping("/petrolsell")
//    public void updatePetrolsell(@RequestBody List<PetrolSell> expenses) {
//        for (PetrolSell expense : expenses) {
//            expense.setDate(expense.getDate());
//            expense.setPump(expense.getPump());
//            expense.setClose_meter(expense.getClose_meter()); // Set the notes
//            expense.setOpen_meter(expense.getOpen_meter());
//            expense.setTotal(expense.getTotal());
//            expense.setTesting(expense.getTesting());
//            expense.setPetrol_ltr(expense.getPetrol_ltr());
//            expense.setRate(expense.getRate());
//            expense.setTotal_sell(expense.getTotal_sell());
//            System.out.println(expense);
//            petrolSellRepository.save(expense);
//        }
//    }
//    @PostMapping("/oilsell")
//    public ResponseEntity<String> updateOilsell(@RequestBody OilSell oilSell) {
//        oilSellRepository.save(oilSell);
//        return ResponseEntity.ok("Purchase updated and saved successfully");
//    }
//    @PostMapping("/jamabaki")
//    public void receivejamabakiadd(@RequestBody List<jamabaki> expenses) {
//        for (jamabaki expense : expenses) {
//            expense.setDate(expense.getDate()); // Set the date
//            expense.setSender(expense.getSender()); // Set the notes
//            expense.setReceiver(expense.getReceiver());
//            expense.setAmount(expense.getAmount());
//            System.out.println(expense.toString());
//            JamabakiRepository.save(expense);
//        }
//    }
//    @GetMapping("/dailyChart")
//    public DailySalesSummaryDTO getSalesReport(@RequestParam String userId) {
//        String sql = "SELECT "
//                + "p.date, "
//                + "p.PetrolSell_Total, "
//                + "d.DieselSell_Total, "
//                + "o.OilSell_Total, "
//                + "k.Kharch_Total, "
//                + "t.Atm_total, "
//                + "j.Jama_Total, "
//                + "j.baki_Total, "
//                + "purchase.total_petrol_purchase, "
//                + "purchase.total_diesel_purchase "
//                + "FROM "
//                + "(SELECT date, SUM(total_sell) AS PetrolSell_Total FROM managment.petrolsell WHERE date = CURDATE()) p "
//                + "JOIN "
//                + "(SELECT date, SUM(total_sell) AS DieselSell_Total FROM managment.dieselsell WHERE date = CURDATE()) d ON p.date = d.date "
//                + "JOIN "
//                + "(SELECT date, SUM(price) AS OilSell_Total FROM managment.oilsell WHERE date = CURDATE()) o ON p.date = o.date "
//                + "JOIN "
//                + "(SELECT date, SUM(price) AS Kharch_Total FROM managment.kharch WHERE date = CURDATE()) k ON p.date = k.date "
//                + "JOIN "
//                + "(SELECT date, SUM(amount) AS Atm_total FROM managment.transaction WHERE date = CURDATE()) t ON p.date = t.date "
//                + "JOIN "
//                + "(SELECT date, SUM(jama) AS Jama_Total, SUM(baki) AS baki_Total FROM managment.jamabakireport WHERE date = CURDATE()) j ON p.date = j.date "
//                + "LEFT JOIN "
//                + "(SELECT "
//                + "date, "
//                + "SUM(CASE WHEN type = 'petrol' THEN total_purchase ELSE 0 END) AS total_petrol_purchase, "
//                + "SUM(CASE WHEN type = 'diesel' THEN total_purchase ELSE 0 END) AS total_diesel_purchase "
//                + "FROM "
//                + "managment.purchase "
//                + "WHERE "
//                + "date = CURDATE() "
//                + "GROUP BY "
//                + "date "
//                + ") purchase ON p.date = purchase.date";
//
////        return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
//        List<DailySalesSummaryDTO> results = jdbcTemplate.query(sql, (rs, rowNum) -> {
//            DailySalesSummaryDTO salesSummary = new DailySalesSummaryDTO();
//            salesSummary.setDate(rs.getDate("date").toString());
//            salesSummary.setPetrolSellTotal(rs.getDouble("PetrolSell_Total"));
//            salesSummary.setDieselSellTotal(rs.getDouble("DieselSell_Total"));
//            salesSummary.setOilSellTotal(rs.getDouble("OilSell_Total"));
//            salesSummary.setKharchTotal(rs.getDouble("Kharch_Total"));
//            salesSummary.setAtmTotal(rs.getDouble("Atm_total"));
//            salesSummary.setJamaTotal(rs.getDouble("Jama_Total"));
//            salesSummary.setBakiTotal(rs.getDouble("baki_Total"));
//            salesSummary.setTotalPetrolPurchase(rs.getDouble("total_petrol_purchase"));
//            salesSummary.setTotalDieselPurchase(rs.getDouble("total_diesel_purchase"));
//            return salesSummary;
//        });
//        return results.isEmpty() ? null : results.get(0);
//    }
