import java.awt.Frame;
import java.awt.GridLayout;
import java.awt.Label;
import java.awt.Panel;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.WindowEvent;
import java.awt.event.WindowListener;
import java.awt.Button;
import java.awt.Color;
import java.awt.Dialog;
import java.awt.Font;
import java.util.Random;

public class Main extends Frame implements WindowListener, ColorTileGUI {
    private ColorTile ct;
    private Button[][] tileTable;
    private static final Font f = new Font("serif", Font.BOLD,16);
    private final ResultDialog resultDialog = new ResultDialog(this, "Result");
    // 色を設定
    private static final Color[] COLORS = {Color.RED, Color.BLUE, Color.GREEN, Color.YELLOW, Color.CYAN, Color.WHITE};
    // 空白はグレー
    private static final Color EMPTY = Color.LIGHT_GRAY;
    // HPは3
    private static final int HP = 3;

    public Main() {
	// タイトルを表示
        super("ColorTile");
	System.out.println("Select difficulty level.");
	
	// 盤面を作成（縦, 横, 空白の数, 色の数）
	while (true) {
	    System.out.print("easy: 1, nomal: 2, Hard: 3  -> ");
	    int input = new java.util.Scanner(System.in).nextInt();
	    // 難易度によって盤面の大きさを変更
	    switch (input) {
	    case 1 -> {
		ct = new ColorTile(10, 10, 30, COLORS.length - 2, HP, true);
		break;
	    } case 2 -> {
		ct = new ColorTile(15, 15, 30, COLORS.length - 1, HP, false);
		break;
	    } case 3 -> { 
		ct = new ColorTile(20, 20, 30, COLORS.length, HP, false);
		break;
	    } default -> {
		continue;
	    }
	    }
	    break;
	}
	
	// 初期化
	init();
        ct.initTable(this);
	System.out.println("HP: " + HP);
    }

    public static void main(String[] args) {
	// Mainメソッドの中身を全て実行
        new Main();
    }

    private void init() {
	// 指定した盤面数のボタンを作成
        this.tileTable = new Button[ct.getHeight()][ct.getWidth()];
	// ウィンドウの設定
        this.addWindowListener(this);
	// ボタンをグリッド状にする
        this.setLayout(new GridLayout(ct.getHeight(), ct.getWidth()));
	// ボタンを作成して並べる
        for (int y = 0; y < ct.getHeight(); y++) {
            for (int x = 0; x < ct.getWidth(); x++) {
                Button tile = new Button();
		// 全てEMPTYにしてグレーにしている
                tile.setBackground(EMPTY);
                tile.setFont(f);
		// マウス入力の処理
                tile.addMouseListener(new MouseEventHandler(ct, this, x, y));
		// 作成したボタンを格納
                tileTable[y][x] = tile;
		// GUIに追加
                this.add(tile);
            }
        }
	// ウィンドウサイズを設定して表示
        this.setSize(50 * ct.getWidth(), 50 * ct.getHeight());
        this.setVisible(true);
    }

    // closeでゲーム終了
    @Override
    public void windowClosing(WindowEvent e) {
        System.exit(0);
    }
    
    // その他は未使用
    @Override
    public void windowOpened(WindowEvent e) {

    }
    @Override
    public void windowClosed(WindowEvent e) {

    }
    @Override
    public void windowIconified(WindowEvent e) {

    }
    @Override
    public void windowDeiconified(WindowEvent e) {

    }
    @Override
    public void windowActivated(WindowEvent e) {

    }
    @Override
    public void windowDeactivated(WindowEvent e) {

    }

    // 指定した場所に指定した色を配置
    @Override
    public void setTileColor(int x, int y, int tileColor){
        this.tileTable[y][x].setBackground(COLORS[tileColor]);
    }
    // 指定した場所を空白に
    @Override
    public void setEmptyTile(int x, int y){
        this.tileTable[y][x].setBackground(EMPTY);
    }
    // 全て消せたときのメッセージ
    @Override
    public void win() {
        resultDialog.showDialog("Win !!!");
    }
    // その他の状態に陥ったときのメッセージ
    @Override
    public void lose() {
        resultDialog.showDialog("Lose ...");
    }
}



// マウス入力の処理
class MouseEventHandler implements MouseListener {
    ColorTile ct;       // ロジックの中身
    ColorTileGUI ctgui; // ゲーム画面
    int x, y;

    MouseEventHandler(ColorTile ct, ColorTileGUI ctgui, int x, int y) {
        this.ct = ct;
        this.ctgui = ctgui;
        this.x = x;
        this.y = y;
    }

    @Override
    // マウス入力の処理
    public void mouseClicked(MouseEvent e) {
        switch (e.getButton()) {
	case MouseEvent.BUTTON1: {
	    // Left click （タイルを開く）
	    ct.openTile(this.x, this.y, ctgui);
	} break;
	case MouseEvent.BUTTON2: {
	    // Wheel click
	} break;
	case MouseEvent.BUTTON3: {
	    // Right click （盤面を新しくする）
	    ct.reset(ctgui);
	} break;
        }
    }

    // その他の処理は未使用
    @Override
    public void mousePressed(MouseEvent e) {
	
    } 
    @Override
    public void mouseReleased(MouseEvent e) {
	
    }  
    @Override
    public void mouseEntered(MouseEvent e) {
	
    }  
    @Override
    public void mouseExited(MouseEvent e) {
	
    }
}

// 結果を表示
class ResultDialog extends Dialog {
    Label label;
    Button btn;

    public ResultDialog(Frame owner, String title) {
        super(owner, title);
	// ２行１列のグリッド
        setLayout(new GridLayout(2, 1));
        Panel p1 = new Panel();
	// 結果表示用ラベル
        label = new Label();
        p1.add(label);
        this.add(p1);
	// ウィンドウのサイズを設定
        this.setSize(200, 100);
	// 「exit」ボタンを作成
        btn = new Button();
        btn.setLabel("exit");
	// マウス入力を処理
        btn.addMouseListener(new MouseListener() {
		// ボタンがクリックされたら終了する
		@Override	    
		public void mouseClicked(MouseEvent e) {
		    System.exit(0);
		}	    
		// その他の処理は未使用
		@Override
		public void mousePressed(MouseEvent e) {

		}
		@Override
		public void mouseReleased(MouseEvent e) {

		}
		@Override
		public void mouseEntered(MouseEvent e) {

		}
		@Override
		public void mouseExited(MouseEvent e) {

		}
	    });
	// 下段のパネルにボタンを追加
	Panel p2 = new Panel();
	p2.add(btn);
	this.add(p2);
    }
    // messageを表示するダイアログを作成
    public void showDialog(String message) {
	Panel p1 = new Panel();
	this.label.setText(message);
	this.setVisible(true);
    }
}
