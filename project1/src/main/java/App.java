/*
 * *****************************************************************************
 * NAME: Tyler D Clark
 * PROJECT: Java 2D Graphics - App.java
 * COURSE: CMSC 405
 * DATE: 23 Jan 2021
 * *****************************************************************************
 */

package main.java;

import javax.swing.*;
import java.awt.*;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;

/**
 * Main worker of the class, derived from the sample file CMSC405P1Template.java
 */
public class App extends JPanel {
  static int translateX = 0;
  static int translateY = 0;
  static double rotation = 0;
  static double scaleX = 1.0;
  static double scaleY = 1.0;
  PixelImage image = new PixelImage();
  BufferedImage tImage = image.getImage(PixelImage.letterT);
  BufferedImage yImage = image.getImage(PixelImage.letterY);
  BufferedImage exclamationImage = image.getImage(PixelImage.exclamationMark);
  private int frameNumber;

  public App() {
    setPreferredSize(new Dimension(800, 600));
    Timer animationTimer = new Timer(1500, arg0 -> {
              frameNumber = (frameNumber > 5) ? 0 : ++frameNumber;
              repaint();
            });
    animationTimer.start();
  }

  // This is where all of the action takes place
  // Code taken from AnimationStarter.java but modified to add the specific Images
  // Also added looping structure for Different transformations
  protected void paintComponent(Graphics g) {

    /* First, create a Graphics2D drawing context for drawing on the panel.
     * (g.create() makes a copy of g, which will draw to the same place as g,
     * but changes to the returned copy will not affect the original.)
     */
    Graphics2D g2 = (Graphics2D) g.create();

    /* Turn on antialiasing in this graphics context, for better drawing.
     */
    g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

    /* Fill in the entire drawing area with white.
     */
    g2.setPaint(Color.WHITE);
    g2.fillRect(0, 0, getWidth(), getHeight()); // From the old graphics API!

    // Controls your zoom and area you are looking at
    applyWindowToViewportTransformation(g2, 10, 75, -75, 75, true);

    AffineTransform savedTransform = g2.getTransform();
    switch (frameNumber) {
      case 1:
        translateX = 0;
        translateY = 0;
        scaleX = 1.0;
        scaleY = 1.0;
        rotation = 0;
        System.out.println("Baseline");
        break;
      case 2:
        translateX = -5;
        translateY = 7;
        System.out.println("Translate -5, 7");
        break;
      case 3:
        rotation += Math.toRadians(45);
        System.out.println("Rotate 45 CCW");
        break;
      case 4:
        rotation += Math.toRadians(-90);
        System.out.println("Rotate 90 CW");
        break;
      case 5:
        scaleX = 2;
        scaleY = 0.5;
        System.out.println("Scale X and Y");
        break;
      default:
        break;
    } // End switch

    g2.translate(translateX, translateY); // Move image.
    g2.rotate(rotation); // Rotate image.
    g2.scale(scaleX, scaleY); // Scale image.
    g2.drawImage(tImage, 0, 0, this); // Draw image.
    g2.setTransform(savedTransform);

    g2.translate(translateX, translateY); // Move image.
    g2.translate(50, 0);
    g2.rotate(rotation); // Rotate image.
    g2.scale(scaleX, scaleY); // Scale image.
    g2.drawImage(yImage, 0, 0, this); // Draw image.
    g2.setTransform(savedTransform);

    g2.translate(translateX, translateY); // Move image.
    g2.translate(100, 0);
    g2.rotate(rotation); // Rotate image.
    g2.scale(scaleX, scaleY); // Scale image.
    g2.drawImage(exclamationImage, 0, 0, this); // Draw image.
    g2.setTransform(savedTransform);

    g2.dispose();
  }

  // Method taken directly from AnimationStarter.java Code
  private void applyWindowToViewportTransformation(
      Graphics2D g2, double left, double right, double bottom, double top, boolean preserveAspect) {
    int width = getWidth(); // The width of this drawing area, in pixels.
    int height = getHeight(); // The height of this drawing area, in pixels.
    if (preserveAspect) {
      // Adjust the limits to match the aspect ratio of the drawing area.
      double displayAspect = Math.abs((double) height / width);
      double requestedAspect = Math.abs((bottom - top) / (right - left));
      if (displayAspect > requestedAspect) {
        // Expand the viewport vertically.
        double excess = (bottom - top) * (displayAspect / requestedAspect - 1);
        bottom += excess / 2;
        top -= excess / 2;
      } else if (displayAspect < requestedAspect) {
        // Expand the viewport vertically.
        double excess = (right - left) * (requestedAspect / displayAspect - 1);
        right += excess / 2;
        left -= excess / 2;
      }
    }
    g2.scale(width / (right - left), height / (bottom - top));
    g2.translate(-left, -top);
  }
}
