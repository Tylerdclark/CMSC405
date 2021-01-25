/*
 * *****************************************************************************
 * NAME: Tyler D Clark
 * PROJECT: Java 2D Graphics - Project1.java
 * COURSE: CMSC 405
 * DATE: 23 Jan 2021
 * *****************************************************************************
 */
package main.java;

import javax.swing.*;

/**
 * Entry point
 */
public class Project1 {

  public static void main(String[] args) {
    JFrame window = new JFrame("Java Animation");
    final App panel = new App();
    window.setContentPane(panel); // Show the panel in the window.
    window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE); // End program when window closes.
    window.pack(); // Set window size based on the preferred sizes of its contents.
    window.setResizable(false); // Don't let user resize window.
    window.setVisible(true); // Open the window, making it visible on the screen.
  }
}
