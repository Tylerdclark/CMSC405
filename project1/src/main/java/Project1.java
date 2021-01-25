package main.java;

import javax.swing.*;

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
