/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pumpManagment.model;

/**
 *
 * @author Dell
 */
public class AuthenticationResponse {

    private String token;
    private String username;
    private String role;
    private Long userId;

      private String petrolNozzle;
    private String dieselNozzle;
      private String xpPetrolNozzle;
    private String powerDieselNozzle;
    
    public AuthenticationResponse() {

    }

    public AuthenticationResponse(String token, String username, String role, Long userId, String petrolNozzle, String dieselNozzle, String xpPetrolNozzle, String powerDieselNozzle) {
        this.token = token;
        this.username = username;
        this.role = role;
        this.userId = userId;
        this.petrolNozzle = petrolNozzle;
        this.dieselNozzle = dieselNozzle;
        this.xpPetrolNozzle = xpPetrolNozzle;
        this.powerDieselNozzle = powerDieselNozzle;
    }

    

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getPetrolNozzle() {
        return petrolNozzle;
    }

    public void setPetrolNozzle(String petrolNozzle) {
        this.petrolNozzle = petrolNozzle;
    }

    public String getDieselNozzle() {
        return dieselNozzle;
    }

    public void setDieselNozzle(String dieselNozzle) {
        this.dieselNozzle = dieselNozzle;
    }

    public String getXpPetrolNozzle() {
        return xpPetrolNozzle;
    }

    public void setXpPetrolNozzle(String xpPetrolNozzle) {
        this.xpPetrolNozzle = xpPetrolNozzle;
    }

    public String getPowerDieselNozzle() {
        return powerDieselNozzle;
    }

    public void setPowerDieselNozzle(String powerDieselNozzle) {
        this.powerDieselNozzle = powerDieselNozzle;
    }
    
    
}
