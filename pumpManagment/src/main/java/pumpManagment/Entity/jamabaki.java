/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pumpManagment.Entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 *
 * @author Dell
 */
@Entity
@Table(name = "jamabakireport")
public class jamabaki {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    @Column(name = "date")
    private String date;
    @Column(name = "name")
    private String name;
    @Column(name = "jama")
    private double jama;
    @Column(name = "baki")
    private double baki;
    @Column(name = "user_id")
    private String userId;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getJama() {
        return jama;
    }

    public void setJama(double jama) {
        this.jama = jama;
    }

    public double getBaki() {
        return baki;
    }

    public void setBaki(double baki) {
        this.baki = baki;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

}
//@Entity
//@Table(name = "jamabaki")
//public class jamabaki {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.AUTO)
//    private Integer idJamabaki;
//    @Column(name = "date")
//    private String date;
//    @Column(name = "sender")
//    private String sender;
//    @Column(name = "receiver")
//    private String receiver;
//    @Column(name = "amount")
//    private String amount;
//
//    public Integer getIdJamabaki() {
//        return idJamabaki;
//    }
//
//    public void setIdJamabaki(Integer idJamabaki) {
//        this.idJamabaki = idJamabaki;
//    }
//
//    public String getDate() {
//        return date;
//    }
//
//    public void setDate(String date) {
//        this.date = date;
//    }
//
//    public String getSender() {
//        return sender;
//    }
//
//    public void setSender(String sender) {
//        this.sender = sender;
//    }
//
//    public String getReceiver() {
//        return receiver;
//    }
//
//    public void setReceiver(String receiver) {
//        this.receiver = receiver;
//    }
//
//    public String getAmount() {
//        return amount;
//    }
//
//    public void setAmount(String amount) {
//        this.amount = amount;
//    }
//
//   
//    
//}
