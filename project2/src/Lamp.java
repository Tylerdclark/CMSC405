
import java.awt.*;
import java.awt.event.*;

import javax.swing.*;

import com.jogamp.opengl.*;
import com.jogamp.opengl.awt.GLJPanel;
import com.jogamp.opengl.util.gl2.GLUT;

/**
 * Shows a scene (a teapot on a short cylindrical base) that is illuminated by
 * up to four lights plus global ambient light. The user can turn the lights on
 * and off. The global ambient light is a dim white. There is a white
 * "viewpoint" light that points from the direction of the viewer into the
 * scene. There is a red light, a blue light, and a green light that rotate in
 * circles above the teapot. (The user can turn the animation on and off.) The
 * locations of the colored lights are marked by spheres, which are gray when
 * the light is off and are colored by some emission color when the light is on.
 * The teapot is gray with weak specular highlights. The base is colored with a
 * spectrum. (The user can turn the display of the base on and off.) The mouse
 * can be used to rotate the scene.
 */
public class Lamp extends JPanel implements GLEventListener {

    private static final long serialVersionUID = 1L;

    public static void main(String[] args) {
        JFrame window = new JFrame("A Lamp");
        Lamp panel = new Lamp();
        window.setContentPane(panel);
        window.pack();
        window.setLocation(50, 50);
        window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        window.setVisible(true);
    }

    private JCheckBox animating; // Checked if animation is running.
    private JCheckBox viewpointLight; // Checked if the white viewpoint light is on.
    private JCheckBox lightOn; // Checked if the light is on.
    private JCheckBox ambientLight; // Checked if the global ambient light is on.
    private GLJPanel display;
    private Timer animationTimer;
    private Camera camera;
    private GLUT glut = new GLUT();

    /**
     * The constructor adds seven checkboxes under the display, to control the
     * options.
     */
    public Lamp() {
        GLCapabilities caps = new GLCapabilities(null);
        display = new GLJPanel(caps);
        display.setPreferredSize(new Dimension(600, 600));
        display.addGLEventListener(this);
        setLayout(new BorderLayout());
        add(display, BorderLayout.CENTER);
        camera = new Camera();
        camera.lookAt(5, 10, 30, 0, 0, 0, 0, 1, 0);
        camera.setScale(15);
        camera.installTrackball(display);
        animationTimer = new Timer(30, new ActionListener() {
            public void actionPerformed(ActionEvent evt) {
                display.repaint();
            }
        });
        ActionListener boxHandler = new ActionListener() {
            public void actionPerformed(ActionEvent evt) {
                if (evt.getSource() == animating) {
                    if (animating.isSelected()) {
                        animationTimer.start();
                    } else {
                        animationTimer.stop();
                    }
                } else {
                    display.repaint();
                }
            }
        };
        viewpointLight = new JCheckBox("Viewpoint Light", true);
        lightOn = new JCheckBox("Lamp Light", true);
        ambientLight = new JCheckBox("Global Ambient Light", true);
        animating = new JCheckBox("Animate", true);

        viewpointLight.addActionListener(boxHandler);
        ambientLight.addActionListener(boxHandler);
        lightOn.addActionListener(boxHandler);
        animating.addActionListener(boxHandler);

        JPanel bottom = new JPanel();
        bottom.setLayout(new GridLayout(2, 1));
        JPanel row1 = new JPanel();
        row1.add(animating);
        row1.add(ambientLight);
        bottom.add(row1);
        JPanel row2 = new JPanel();
        row2.add(viewpointLight);
        row2.add(lightOn);
        bottom.add(row2);
        add(bottom, BorderLayout.SOUTH);
        animationTimer.setInitialDelay(500);
        animationTimer.start();
    }

    // ----------------------------- Methods for drawing
    // -------------------------------

    /**
     * Sets the positions of the colored lights and turns them on and off, depending
     * on the state of the redLight, greenLight, and blueLight options. Draws a
     * small sphere at the location of each light.
     */
    private void lights(GL2 gl) {

        gl.glColor3d(0.5, 0.5, 0.5);
        float zero[] = { 0, 0, 0, 1 };
        gl.glMaterialfv(GL2.GL_FRONT_AND_BACK, GL2.GL_SPECULAR, zero, 0);

        if (viewpointLight.isSelected())
            gl.glEnable(GL2.GL_LIGHT0);
        else
            gl.glDisable(GL2.GL_LIGHT0);

        if (lightOn.isSelected()) {
            float bulbColor[] = { 1, 1, 0.5F, 1 };
            gl.glLightModeli(GL2.GL_LIGHT_MODEL_TWO_SIDE, 1);// need to illuminate both sides
            gl.glMaterialfv(GL2.GL_FRONT_AND_BACK, GL2.GL_EMISSION, bulbColor, 0);
            gl.glEnable(GL2.GL_LIGHT1);
        } else {
            gl.glMaterialfv(GL2.GL_FRONT_AND_BACK, GL2.GL_EMISSION, zero, 0);
            gl.glDisable(GL2.GL_LIGHT1);
        }
        gl.glPushMatrix();
        gl.glTranslated(0, 3.5, 0);
        gl.glLightfv(GL2.GL_LIGHT1, GL2.GL_POSITION, zero, 0);
        glut.glutSolidSphere(0.5, 16, 8); // The light bulb
        gl.glPopMatrix();
        gl.glMaterialfv(GL2.GL_FRONT_AND_BACK, GL2.GL_EMISSION, zero, 0); // Turn off emission color!
    } // end lights()

    /**
     * Draws a cylinder with height 2 and radius 1, centered at the origin, with its
     * axis along the z-axis. A spectrum of hues is applied to the vertices along
     * the edges of the cylinder. (Since GL_COLOR_MATERIAL is enabled in this
     * program, the colors specified here are used as ambient and diffuse material
     * colors for the cylinder.)
     */
    private void drawCylinder(GL2 gl) {
        gl.glBegin(GL2.GL_TRIANGLE_STRIP);
        for (int i = 0; i <= 64; i++) {
            double angle = 2 * Math.PI / 64 * i;
            double x = Math.cos(angle);
            double y = Math.sin(angle);
            gl.glNormal3d(x, y, 0); // Normal for both vertices at this angle.
            gl.glVertex3d(x, y, 1); // Vertex on the top edge.
            gl.glVertex3d(x, y, -1); // Vertex on the bottom edge.
        }
        gl.glEnd();
        gl.glNormal3d(0, 0, 1);
        gl.glBegin(GL2.GL_TRIANGLE_FAN); // Draw the top, in the plane z = 1.
        gl.glColor3d(1, 1, 1); // ambient and diffuse for center
        gl.glVertex3d(0, 0, 1);
        for (int i = 0; i <= 64; i++) {
            double angle = 2 * Math.PI / 64 * i;
            double x = Math.cos(angle);
            double y = Math.sin(angle);
            gl.glVertex3d(x, y, 1);
        }
        gl.glEnd();
        gl.glNormal3f(0, 0, -1);
        gl.glBegin(GL2.GL_TRIANGLE_FAN); // Draw the bottom, in the plane z = -1
        gl.glColor3d(1, 1, 1); // ambient and diffuse for center
        gl.glVertex3d(0, 0, -1);
        for (int i = 64; i >= 0; i--) {
            double angle = 2 * Math.PI / 64 * i;
            double x = Math.cos(angle);
            double y = Math.sin(angle);
            gl.glVertex3d(x, y, -1);
        }
        gl.glEnd();
    }

    /**
     * Draws a hollow cylinder which I am saying looks a little like a lamp shade
     * @param gl
     */
    private void drawShade(GL2 gl) {
        double x = 0.0;
        double y = 0.0;
        double angle = 0.0;
        double step_size = 0.075;
        double radius = 5.0;
        double height = 5.0;

        /* Draw the tube */
        gl.glColor3d(1, 1, 1); // ambient and diffuse for center
        gl.glBegin(GL2.GL_QUAD_STRIP);
        angle = 0.0;
        while (angle <= 2 * Math.PI) {
            x = radius * Math.cos(angle);
            y = radius * Math.sin(angle);
            gl.glNormal3d(-x, -1, -y);
            gl.glVertex3d(x, height, y);
            gl.glVertex3d(x, 0, y);
            angle = angle + step_size;
        }
        gl.glVertex3d(radius, height, 0.0);
        gl.glVertex3d(radius, 0.0, 0.0);
        gl.glEnd();
    }

    // --------------- Methods of the GLEventListener interface -----------

    /**
     * Draws the scene.
     */
    public void display(GLAutoDrawable drawable) {
        // called when the panel needs to be drawn

        GL2 gl = drawable.getGL().getGL2();

        gl.glClearColor(0, 0, 0, 0);
        gl.glClear(GL2.GL_COLOR_BUFFER_BIT | GL2.GL_DEPTH_BUFFER_BIT);

        camera.apply(gl);

        lights(gl);

        float zero[] = { 0, 0, 0, 1 };

        if (ambientLight.isSelected()) {
            gl.glLightModelfv(GL2.GL_LIGHT_MODEL_AMBIENT, new float[] { 0.15F, 0.15F, 0.15F, 1 }, 0);
        } else {
            gl.glLightModelfv(GL2.GL_LIGHT_MODEL_AMBIENT, zero, 0);
        }

        gl.glMaterialfv(GL2.GL_FRONT_AND_BACK, GL2.GL_SPECULAR, new float[] { 0.2F, 0.2F, 0.2F, 1 }, 0);

        /* Original base, scaled for my purposes */
        gl.glPushMatrix();
        gl.glTranslated(0, -7, 0);
        gl.glRotated(-90, 1, 0, 0);
        gl.glScaled(5, 5, 0.5);
        drawCylinder(gl);
        gl.glPopMatrix();

        /* The lamp shade and vertical post */
        gl.glPushMatrix();
        drawShade(gl);
        gl.glTranslated(0, -2, 0);
        gl.glScaled(0.5, 5, 0.5);
        gl.glRotated(90, 0, 0, 0);
        drawCylinder(gl);
        gl.glPopMatrix();

        // One of the shade rail thingies
        gl.glPushMatrix();
        gl.glTranslated(0, 2.75, 0);
        gl.glScaled(0.1, 0.1, 5);
        drawCylinder(gl);
        gl.glPopMatrix();

    }

    /**
     * Initialization, including setting up a camera and configuring the four
     * lights.
     */
    public void init(GLAutoDrawable drawable) {
        GL2 gl = drawable.getGL().getGL2();
        gl.glClearColor(0, 0, 0, 1);
        gl.glEnable(GL2.GL_DEPTH_TEST);
        gl.glEnable(GL2.GL_LIGHTING);
        gl.glEnable(GL2.GL_LIGHT0);
        gl.glEnable(GL2.GL_NORMALIZE);
        gl.glEnable(GL2.GL_COLOR_MATERIAL);
        gl.glLightModeli(GL2.GL_LIGHT_MODEL_LOCAL_VIEWER, 1);
        gl.glMateriali(GL2.GL_FRONT_AND_BACK, GL2.GL_SHININESS, 32);

        float dim[] = { 0.5F, 0.5F, 0.5F, 1 };
        gl.glLightfv(GL2.GL_LIGHT0, GL2.GL_DIFFUSE, dim, 0);
        gl.glLightfv(GL2.GL_LIGHT0, GL2.GL_SPECULAR, dim, 0);

        float white[] = { 1, 1, 1, 1 };
        float whiteA[] = { 0.1F, 0.1F, 0.1f, 1 };
        gl.glLightfv(GL2.GL_LIGHT1, GL2.GL_AMBIENT, whiteA, 0);
        gl.glLightfv(GL2.GL_LIGHT1, GL2.GL_DIFFUSE, white, 0);
        gl.glLightfv(GL2.GL_LIGHT1, GL2.GL_SPECULAR, white, 0);

    }

    /**
     * Called when the size of the GLJPanel changes.
     */
    public void reshape(GLAutoDrawable drawable, int x, int y, int width, int height) {
    }

    /**
     * This is called before the GLJPanel is destroyed.
     */
    public void dispose(GLAutoDrawable drawable) {
    }

}
