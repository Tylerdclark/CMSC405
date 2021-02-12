/*
 * *****************************************************************************
 * NAME: Tyler D Clark
 * PROJECT: Java 2D Graphics - Project2.java
 * COURSE: CMSC 405
 * DATE: 08 Feb 2021
 * *****************************************************************************
 */

import com.jogamp.opengl.*;
import com.jogamp.opengl.awt.GLJPanel;
import com.jogamp.opengl.fixedfunc.GLLightingFunc;
import com.jogamp.opengl.fixedfunc.GLMatrixFunc;
import com.jogamp.opengl.glu.GLU;
import com.jogamp.opengl.util.Animator;
import com.jogamp.opengl.util.gl2.GLUT;

import javax.swing.event.MouseInputAdapter;
import java.awt.*;
import java.awt.event.*;

public class Project2 {

    /** Main here */
    public static void main(final String[] args) {
        final Frame frame = new Frame();
        final GLJPanel panel = new GLJPanel();
        final Renderer renderer = new Renderer();
        final MouseHandler inputMouseHandler = new MouseHandler(renderer);
        final KeyHandler inputKeyHandler = new KeyHandler(renderer);

        panel.addMouseListener(inputMouseHandler);
        panel.addMouseMotionListener(inputMouseHandler);
        panel.addKeyListener(inputKeyHandler);

        panel.addGLEventListener(renderer);
        frame.add(panel);
        frame.add(panel);
        frame.setSize(600, 600);
        final Animator animator = new Animator(panel);
        frame.addWindowListener(new WindowAdapter() {
            public void windowClosing(final WindowEvent e) {
                new Thread(() -> {
                    animator.stop();
                    System.exit(0);
                }).start();
            }
        });
        frame.setVisible(true);
        animator.start();
    }

    /**
     * Handles rendering and gets passed to the handlers
     */
    static class Renderer implements GLEventListener {

        private final GLU glu = new GLU();
        private final GLUT glut = new GLUT();
        private float scaleAll = 1f;
        private float rotX = 35.0f;
        private float rotY = 0.0f;
        private float tranX = 0;
        private float tranY = 0;

        private final Point mousePoint = new Point();
        float[] lightAmbient = { 0.3f, 0.3f, 0.3f, 1.0f };
        float[] lightDiffuse = { 0.5f, 0.5f, 0.5f, 1.0f };
        float[] lightSpecular = { 0.5f, 0.5f, 0.5f, 1.0f };

        /**
         * Display method
         *
         * @param gLDrawable The GLDrawable object.
         */
        public void display(final GLAutoDrawable gLDrawable) {

            final GL2 gl = gLDrawable.getGL().getGL2();
            gl.glClear(GL.GL_COLOR_BUFFER_BIT | GL.GL_DEPTH_BUFFER_BIT);
            gl.glLoadIdentity();

            glu.gluLookAt(0, 5, 10, 0, 0, 0, 0, 1, 0);

            gl.glTranslatef(tranX, tranY, 0);

            gl.glPushMatrix();
            gl.glRotatef(rotY, 1.0f, 0.0f, 0);
            gl.glRotatef(rotX, 0.0f, 1.0f, 0);
            gl.glColor3d(0.294, 0.000, 0.510);
            gl.glScalef(scaleAll, scaleAll / 10, scaleAll);
            glut.glutSolidCube(.5f);
            gl.glPopMatrix();

            gl.glPushMatrix();
            gl.glScalef(scaleAll / 10, scaleAll / 10, scaleAll / 10);
            gl.glRotatef(rotY, 1.0f, 0.0f, 0.0f);
            gl.glRotatef(rotX, 0.0f, 1.0f, 0.0f);
            gl.glTranslatef(-1.75f, 1, -1.5f);
            gl.glColor3d(0.251, 0.878, 0.816);
            glut.glutSolidSphere(0.5, 100, 100);
            gl.glPopMatrix();

            gl.glPushMatrix();
            gl.glScalef(scaleAll / 10, scaleAll / 10, scaleAll / 10);
            gl.glRotatef(rotY, 1.0f, 0.0f, 0.0f);
            gl.glRotatef(rotX, 0.0f, 1.0f, 0.0f);
            gl.glTranslatef(-1.75f, 1, 1.75f);
            gl.glColor3d(1.000, 0.000, 1.000);
            glut.glutSolidTorus(.2, .5, 100, 100);
            gl.glPopMatrix();

            gl.glPushMatrix();
            gl.glScalef(scaleAll / 10, scaleAll / 10, scaleAll / 10);
            gl.glRotatef(rotY, 1.0f, 0.0f, 0.0f);
            gl.glRotatef(rotX, 0.0f, 1.0f, 0.0f);
            gl.glTranslatef(1.75f, 0.5f, -2);
            gl.glRotatef(-90, 1.0f, 0.0f, 0.0f);

            gl.glColor3d(1.000, 0.627, 0.478);
            glut.glutSolidCylinder(.5, 1, 100, 100);
            gl.glPopMatrix();

            gl.glPushMatrix();
            gl.glScalef(scaleAll / 10, scaleAll / 10, scaleAll / 10);
            gl.glRotatef(rotY, 1.0f, 0.0f, 0.0f);
            gl.glRotatef(rotX, 0.0f, 1.0f, 0.0f);
            gl.glTranslatef(2, 0.5f, 1.5f);
            gl.glRotatef(-90, 1.0f, 0.0f, 0.0f);
            gl.glColor3d(0.000, 1.000, 0.498);
            glut.glutSolidCone(.5, 1, 100, 100);
            gl.glPopMatrix();

            gl.glPushMatrix();
            gl.glScalef(scaleAll / 10, scaleAll / 10, scaleAll / 10);
            gl.glRotatef(rotY, 1.0f, 0.0f, 0.0f);
            gl.glRotatef(rotX, 0.0f, 1.0f, 0.0f);
            gl.glTranslatef(0, 1, 0);
            gl.glColor3d(0.545, 0.000, 0.000);
            glut.glutSolidTetrahedron();
            gl.glPopMatrix();

            gl.glFlush();
        }

        public void displayChanged() {
        }

        /**
         * Called by the drawable immediately after the OpenGL context is initialized
         * for the first time. Can be used to perform one-time OpenGL initialization
         * such as setup of lights and display lists.
         * 
         * @param gLDrawable The GLDrawable object.
         */
        public void init(final GLAutoDrawable gLDrawable) {

            final GL2 gl = gLDrawable.getGL().getGL2();

            // Set the light
            final float[] lightPosition = { 0, 50000000, 0, 1.0f };
            final float[] model_ambient = { 0.5f, 0.5f, 0.5f, 1.0f };

            gl.glLightModelfv(GL2ES1.GL_LIGHT_MODEL_AMBIENT, model_ambient, 0);
            gl.glLightfv(GLLightingFunc.GL_LIGHT0, GLLightingFunc.GL_POSITION, lightPosition, 0);
            gl.glLightfv(GLLightingFunc.GL_LIGHT0, GLLightingFunc.GL_DIFFUSE, lightDiffuse, 0);
            gl.glLightfv(GLLightingFunc.GL_LIGHT0, GLLightingFunc.GL_AMBIENT, lightAmbient, 0);
            gl.glLightfv(GLLightingFunc.GL_LIGHT0, GLLightingFunc.GL_SPECULAR, lightSpecular, 0);

            gl.glEnable(GLLightingFunc.GL_LIGHT0);
            gl.glEnable(GLLightingFunc.GL_LIGHTING);
            gl.glEnable(GLLightingFunc.GL_NORMALIZE);
            gl.glEnable(GLLightingFunc.GL_COLOR_MATERIAL);

            gl.glEnable(GL.GL_CULL_FACE);
            gl.glShadeModel(GLLightingFunc.GL_SMOOTH);
            gl.glClearColor(0.0f, 0.0f, 0.0f, 1.0f);
            gl.glClearDepth(1.0f);
            gl.glEnable(GL.GL_DEPTH_TEST);
            gl.glDepthFunc(GL.GL_LEQUAL);
            gl.glHint(GL2.GL_PERSPECTIVE_CORRECTION_HINT, GL.GL_NICEST);

            gl.glMatrixMode(GLMatrixFunc.GL_MODELVIEW);

        }

        /**
         * Called by the drawable during the first repaint after the component has been
         * resized. The client can update the viewport and view volume of the window
         * appropriately, for example by a call to GL.glViewport(int, int, int, int);
         * note that for convenience the component has already called GL.glViewport(int,
         * int, int, int)(x, y, width, height) when this method is called, so the client
         * may not have to do anything in this method.
         * 
         * @param gLDrawable The GLDrawable object.
         * @param x          The X Coordinate of the viewport rectangle.
         * @param y          The Y coordinate of the viewport rectangle.
         * @param width      The new width of the window.
         * @param height     The new height of the window.
         */
        public void reshape(final GLAutoDrawable gLDrawable, final int x, final int y, final int width, int height) {
            final GL2 gl = gLDrawable.getGL().getGL2();

            if (height <= 0)
                height = 1;

            gl.glViewport(0, 0, width, height);
            gl.glMatrixMode(GLMatrixFunc.GL_PROJECTION);
            gl.glLoadIdentity();
            gl.glOrtho(-1, 1, -1, 1, -50, 50);
            gl.glMatrixMode(GLMatrixFunc.GL_MODELVIEW);
            gl.glLoadIdentity();
        }

        public void dispose(final GLAutoDrawable drawable) {
        }

        /**
         * Get the point at the start of the mouse drag
         *
         * @param MousePt The mouse position
         */
        void startDrag(final Point MousePt) {
            mousePoint.x = MousePt.x;
            mousePoint.y = MousePt.y;
        }

        /**
         * Calculate the delta and rotation values for the dragging of the mouse
         * 
         * @param MousePt The mouse position
         */
        void drag(final Point MousePt) {
            final Point delta = new Point();
            delta.x = MousePt.x - mousePoint.x;
            delta.y = MousePt.y - mousePoint.y;

            mousePoint.x = MousePt.x;
            mousePoint.y = MousePt.y;

            rotX += delta.x / scaleAll;
            rotY += delta.y / scaleAll;
        }

    }

    /**
     * Mouse handler class that allows the user to rotate
     */
    static class MouseHandler extends MouseInputAdapter {
        private final Renderer renderer;

        /**
         * Creates a new instance of the mouse handler
         *
         * @param renderer instance of the renderer
         */
        public MouseHandler(final Renderer renderer) {
            this.renderer = renderer;
        }

        /**
         * Handles the mouse click events
         *
         * @param e The mouse event to handle
         */
        public void mouseClicked(final MouseEvent e) {
        }

        /**
         * Handles the mouse press events
         *
         * @param mouseEvent The mouse event to handle
         */
        public void mousePressed(final MouseEvent mouseEvent) {

            renderer.startDrag(mouseEvent.getPoint());

        }

        /**
         * Handles the mouse drag events
         *
         * @param mouseEvent The mouse event to handle
         */
        public void mouseDragged(final MouseEvent mouseEvent) {
            renderer.drag(mouseEvent.getPoint());
        }

    }

    /**
     * Key event handler class that allows the user to translate
     */
    static class KeyHandler implements KeyListener {
        private final Renderer renderer;

        public KeyHandler(Renderer renderer) {
            this.renderer = renderer;
        }

        /**
         * Invoked when a key has been typed. See the class description for
         * {@link KeyEvent} for a definition of a key typed event.
         *
         * @param e the event to be processed
         */
        @Override
        public void keyTyped(KeyEvent e) {

        }

        /**
         * Invoked when a key has been pressed. See the class description for
         * {@link KeyEvent} for a definition of a key pressed event.
         *
         * @param e the event to be processed
         */
        @Override
        public void keyPressed(KeyEvent e) {

            switch (e.getKeyCode()) {
                case KeyEvent.VK_DOWN:
                    renderer.tranY -= 0.1f;
                    break;
                case KeyEvent.VK_UP:
                    renderer.tranY += 0.1f;
                    break;
                case KeyEvent.VK_LEFT:
                    renderer.tranX -= 0.1f;
                    break;
                case KeyEvent.VK_RIGHT:
                    renderer.tranX += 0.1f;
                    break;
                case KeyEvent.VK_A:
                    renderer.scaleAll += 0.1f;
                    break;
                case KeyEvent.VK_Z:
                    renderer.scaleAll -= 0.1f;
                    break;
            }
        }

        /**
         * Invoked when a key has been released. See the class description for
         * {@link KeyEvent} for a definition of a key released event.
         *
         * @param e the event to be processed
         */
        @Override
        public void keyReleased(KeyEvent e) {

        }
    }

}
