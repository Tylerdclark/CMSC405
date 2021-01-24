/*
 * *****************************************************************************
 * NAME: Tyler D Clark
 * PROJECT: Java 2D Graphics - PixelImage.java
 * COURSE: CMSC 405
 * DATE: 23 Jan 2021
 * *****************************************************************************
 */

package main.java;

import java.awt.*;
import java.awt.image.BufferedImage;

public class PixelImage {

    private static final int white = Color.WHITE.getRGB();
    private static final int cyan = Color.CYAN.getRGB();
    private static final int black = Color.BLACK.getRGB();
    private static final int red = Color.RED.getRGB();
    
    public static int[][] letterT = {
            {white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white},
            {white, white, cyan, cyan, cyan, black, black, black, black, black, black, black, black, black, black, black, black, black, black, black, red, red, red, white, white},
            {white, white, cyan, cyan, cyan, black, black, black, black, black, black, black, black, black, black, black, black, black, black, black, red, red, red, white, white},
            {white, white, cyan, cyan, cyan, black, black, black, black, black, black, black, black, black, black, black, black, black, black, black, red, red, red, white, white},
            {white, white, white, white, white, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white}};


    public static int[][] letterY = {
            {white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white},
            {white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white},
            {white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white},
            {white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white},
            {white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white},
            {white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white},
            {white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white},
            {white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white},
            {white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white},
            {white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white},
            {white, white, white, white, white, cyan, cyan, cyan, black, black, black, black, black, black, black, black, black, red, red, red, white, white, white, white, white},
            {white, white, white, white, white, cyan, cyan, cyan, black, black, black, black, black, black, black, black, black, red, red, red, white, white, white, white, white},
            {white, white, white, white, white, cyan, cyan, cyan, black, black, black, black, black, black, black, black, black, red, red, red, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white}};

    public static int[][] exclamationMark = {
            {white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, cyan, cyan, cyan, black, black, black, black, black, black, black, black, black, red, red, red, white, white, white, white, white},
            {white, white, white, white, white, cyan, cyan, cyan, black, black, black, black, black, black, black, black, black, red, red, red, white, white, white, white, white},
            {white, white, white, white, white, cyan, cyan, cyan, black, black, black, black, black, black, black, black, black, red, red, red, white, white, white, white, white},
            {white, white, white, white, white, cyan, cyan, cyan, black, black, black, black, black, black, black, black, black, red, red, red, white, white, white, white, white},
            {white, white, white, white, white, cyan, cyan, cyan, black, black, black, black, black, black, black, black, black, red, red, red, white, white, white, white, white},
            {white, white, white, white, white, cyan, cyan, cyan, black, black, black, black, black, black, black, black, black, red, red, red, white, white, white, white, white},
            {white, white, white, white, white, cyan, cyan, cyan, black, black, black, black, black, black, black, black, black, red, red, red, white, white, white, white, white},
            {white, white, white, white, white, cyan, cyan, cyan, black, black, black, black, black, black, black, black, black, red, red, red, white, white, white, white, white},
            {white, white, white, white, white, cyan, cyan, cyan, black, black, black, black, black, black, black, black, black, red, red, red, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, cyan, cyan, cyan, black, black, black, red, red, red, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white},
            {white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white, white}};

    public BufferedImage getImage(int[][] data) {
        BufferedImage image = new BufferedImage(25, 25, BufferedImage.TYPE_INT_RGB);
        for (int y = 0; y < 25; y++) {
            for (int x = 0; x < 25; x++) {
                image.setRGB(x, y, data[x][y]);
            }
        }
        return image;
    }
}
