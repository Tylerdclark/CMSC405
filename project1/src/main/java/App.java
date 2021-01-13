package main.java;

import java.awt.*;
import java.awt.event.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import javax.imageio.ImageIO;
import javax.swing.*;
import javax.swing.filechooser.FileNameExtensionFilter;

@SuppressWarnings("serial")
public class App extends JPanel {
    private static final int BI_WIDTH = 600;
    private static final int BI_HEIGHT = BI_WIDTH;
    private static final Color LABEL_DRAW_COLOR = new Color(180, 180, 255);
    private static final Stroke LABEL_DRAW_STROKE = new BasicStroke(1);
    private static final Stroke BIMAGE_DRAW_STROKE = new BasicStroke(4);
    private static final int COLOR_DIV = 5;
    private BufferedImage bImage = new BufferedImage(BI_WIDTH, BI_HEIGHT,
            BufferedImage.TYPE_INT_RGB);
    private List<Point> pointList = new ArrayList<Point>();
    private JLabel imageLabel;
    private List<Color> colorList = new ArrayList<Color>();
    private Random random = new Random();

    public App() {
        Graphics2D g2d = bImage.createGraphics();
        g2d.setBackground(Color.white);
        g2d.clearRect(0, 0, BI_WIDTH, BI_HEIGHT);
        g2d.dispose();

        for (int r = 0; r < COLOR_DIV; r++) {
            for (int g = 0; g < COLOR_DIV; g++) {
                for (int b = 0; b < COLOR_DIV; b++) {
                    Color c = new Color((r * 255) / COLOR_DIV,
                            (g * 255) / COLOR_DIV, (b * 255) / COLOR_DIV);
                    colorList.add(c);
                }
            }
        }

        imageLabel = new JLabel(new ImageIcon(bImage)) {
            @Override
            protected void paintComponent(Graphics g) {
                super.paintComponent(g);
                paintInLabel(g);
            }
        };
        MyMouseAdapter myMouseAdapter = new MyMouseAdapter();
        imageLabel.addMouseListener(myMouseAdapter);
        imageLabel.addMouseMotionListener(myMouseAdapter);
        imageLabel.setBorder(BorderFactory.createEtchedBorder());

        JButton saveImageBtn = new JButton("Save Image");
        saveImageBtn.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                saveImageActionPerformed();
            }
        });

        JButton clearImageBtn = new JButton("Clear Image");
        clearImageBtn.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                Graphics2D g2 = bImage.createGraphics();
                g2.setBackground(Color.white);
                g2.clearRect(0, 0, BI_WIDTH, BI_HEIGHT);
                g2.dispose();
                imageLabel.repaint();
            }
        });

        JPanel btnPanel = new JPanel();
        btnPanel.add(saveImageBtn);
        btnPanel.add(clearImageBtn);

        setLayout(new BorderLayout());
        add(imageLabel, BorderLayout.CENTER);
        add(btnPanel, BorderLayout.SOUTH);
    }

    private void saveImageActionPerformed() {
        JFileChooser filechooser = new JFileChooser();
        FileNameExtensionFilter filter = new FileNameExtensionFilter(
                "JPG Images", "jpg");
        filechooser.setFileFilter(filter);
        int result = filechooser.showSaveDialog(this);
        if (result == JFileChooser.APPROVE_OPTION) {
            File saveFile = filechooser.getSelectedFile();
            try {
                ImageIO.write(bImage, "jpg", saveFile);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    private void paintInLabel(Graphics g) {
        Graphics2D g2d = (Graphics2D) g;
        g2d.setColor(LABEL_DRAW_COLOR);
        g2d.setStroke(LABEL_DRAW_STROKE);
        if (pointList.size() < 2) {
            return;
        }
        for (int i = 1; i < pointList.size(); i++) {
            int x1 = pointList.get(i - 1).x;
            int y1 = pointList.get(i - 1).y;
            int x2 = pointList.get(i).x;
            int y2 = pointList.get(i).y;
            g2d.drawLine(x1, y1, x2, y2);
        }
    }

    private class MyMouseAdapter extends MouseAdapter {

        @Override
        public void mousePressed(MouseEvent e) {
            pointList.add(e.getPoint());
            imageLabel.repaint();
        }

        @Override
        public void mouseReleased(MouseEvent e) {
            Graphics2D g2d = bImage.createGraphics();
            g2d.setColor(colorList.get(random.nextInt(colorList.size())));
            g2d.setStroke(BIMAGE_DRAW_STROKE);
            if (pointList.size() >= 2) {
                for (int i = 1; i < pointList.size(); i++) {
                    int x1 = pointList.get(i - 1).x;
                    int y1 = pointList.get(i - 1).y;
                    int x2 = pointList.get(i).x;
                    int y2 = pointList.get(i).y;
                    g2d.drawLine(x1, y1, x2, y2);
                }
            }
            g2d.dispose();

            pointList.clear();
            imageLabel.repaint();
        }

        @Override
        public void mouseDragged(MouseEvent e) {
            pointList.add(e.getPoint());
            imageLabel.repaint();
        }
    }

    private static void createAndShowUI() {
        JFrame frame = new JFrame("DrawAndSaveImage");
        frame.getContentPane().add(new App());
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.pack();
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);
    }

    public static void main(String[] args) {
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                createAndShowUI();
            }
        });
    }
}