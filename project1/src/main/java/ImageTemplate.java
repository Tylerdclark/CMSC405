/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package main.java;

import java.awt.Color;
import java.awt.image.BufferedImage;

/**
 *
 * @author jim
 */
public class ImageTemplate {
    // Constants
    // X Size of Images
    private final static int IMGSIZEX = 10;
    // Y Size of Images
    private final static int IMGSIZEY = 10;
    
    // Define a Simple Images based on the Alphabet
    // Use static so can send them into the getImage() method remotely
    // Note these are 10x10 and can be modified to any desired
    // image size by adding or removing rows and columns
   public static int[][] letterT = {
        {0, 1, 1, 1, 1, 1, 1, 1, 1, 0},
        {0, 1, 1, 1, 1, 1, 1, 1, 1, 0},
        {0, 0, 0, 0, 1, 1, 0, 0, 0, 0},
        {0, 0, 0, 0, 1, 1, 0, 0, 0, 0},
        {0, 0, 0, 0, 1, 1, 0, 0, 0, 0},
        {0, 0, 0, 0, 1, 1, 0, 0, 0, 0},
        {0, 0, 0, 0, 1, 1, 0, 0, 0, 0},
        {0, 0, 0, 0, 1, 1, 0, 0, 0, 0},
        {0, 0, 0, 0, 1, 1, 0, 0, 0, 0},
        {0, 0, 0, 0, 1, 1, 0, 0, 0, 0}};

  // You can add more images and interesting shapes here

    // Methods to apply pixel colors and
    public BufferedImage getImage(int[][] data) {
        BufferedImage image = new BufferedImage(IMGSIZEX, IMGSIZEY,
                BufferedImage.TYPE_INT_RGB);
        for (int x = 0; x < IMGSIZEX; x++) {
            for (int y = 0; y < IMGSIZEY; y++) {
                int pixelColor = data[x][y];
                // Set Colors based on Binary Image value
                if (pixelColor == 0) {
                    pixelColor = Color.WHITE.getRGB();
                } else {
                    pixelColor = Color.BLACK.getRGB();
                }
                image.setRGB(x, y, pixelColor);
            } // End for y.
        } // End for x.
        return image;
    } // End getData method.

    

}
