interface ColorTileGUI {
    // 指定した座標に色を配置
    public void setTileColor(int x, int y, int tileColor);
    // 盤面に空白をセットする
    public void setEmptyTile(int x, int y);
    // 勝ち
    public void win();
    // 負け
    public void lose();
}
public class ColorTile {
    private final int height;            // 縦
    private final int width;             // 横
    private final int[][] table;         // 盤面
    private final int defaultEmptyCount; // 空白の数
    private final int totalColors;       // 色の種類数
    private int score;                   // スコア
    private static int HP;               // ライフ
    private final int defaultHP;         // デフォルトのライフ
    private boolean level;               // easyかどうかを判断
    private boolean scorePrint;          // スコアを表示したかどうか


    public ColorTile(int height, int width, int defaultEmptyCount, int totalColors, int HP, boolean level) {
        this.height = height;
        this.width = width;
        this.table = new int[height][width];
        this.defaultEmptyCount = defaultEmptyCount;
        this.totalColors = totalColors;
        this.score = 0;
	this.HP = HP;
	this.defaultHP = HP;
	this.level = level;
	this.scorePrint = false;
    }

    // getter
    public int getHeight() {
        return height;
    }
    public int getWidth() {
        return width;
    }

    // 盤面を初期化する
    public void initTable(ColorTileGUI gui) {
	// 空白をセットする
        this.setEmpties();
	
        /* ----- add here ----- */
	// 空白でない全てのマスに、色をランダムにセットする
	for (int i = 0; i < height; i++) {
	    for (int j = 0; j < width; j++) {
		if (this.table[i][j] != -1) {
		    // 色をランダムに選ぶ
		    int color = new java.util.Random().nextInt(totalColors);
		    // 色をセットする
		    this.table[i][j] = color;
		    gui.setTileColor(j, i, color);
		}
	    }
	}
    }
    // 盤面に空白をセットする
    void setEmpties() {
        /* ----- add here ----- */
	int place = 0;
	
	// x,y軸からランダムに選び、空白をセットする
	while (place < defaultEmptyCount) {
	    int x = new java.util.Random().nextInt(width);
	    int y = new java.util.Random().nextInt(height);

	    // 空白がすでにセットされていればcontinue
	    if (this.table[y][x] == -1) continue;
	    // 空白マスには-1を格納
	    this.table[y][x] = -1;
	    place++;
	}
    }
    // タイルを開く
    public void openTile(int x, int y, ColorTileGUI gui) {
        /* ----- add here ----- */
	// EMPTYマス以外をクリックしても何も起きないようにする
	if (this.table[y][x] != -1) {
	    return;
	}

	
	// 指定した座標から上下左右の最も近いタイルの色を格納する配列
	int[] color = new int[4];
	// タイルの座標を格納する([上下左右][x,y座標])
	int[][] coordinate = new int[4][2];

	// 初期化する
	for (int i = 0; i < color.length; i++) {
	    color[i] = -2;
	}
	for (int i = 0; i < 4; i++) {
	    for (int j = 0; j < 2; j++) {
		coordinate[i][j] = -1;
	    }
	}

	
	// 添字０を下回らないように、上を確認していく
	int tmpY = y - 1;
	while (tmpY >= 0 && this.table[tmpY][x] == -1) {
	    tmpY--;
	}
	if (tmpY >= 0) {
	    color[0] = this.table[tmpY][x];
	    coordinate[0][0] = x;
	    coordinate[0][1] = tmpY;
	}
	
	// 添字heightを上回らないように、下を確認していく
	tmpY = y + 1;
	while (tmpY < height && this.table[tmpY][x] == -1) {
	    tmpY++;
	}
	if (tmpY < height) {
	    color[1] = this.table[tmpY][x];
	    coordinate[1][0] = x;
	    coordinate[1][1] = tmpY;
	}
	
	// 添字０を下回らないように、左を確認していく
	int tmpX = x - 1;
	while (tmpX >= 0 && this.table[y][tmpX] == -1) {
	    tmpX--;
	}
	if (tmpX >= 0) {
	    color[2] = this.table[y][tmpX];
	    coordinate[2][0] = tmpX;
	    coordinate[2][1] = y;
	}
	
	// 添字heightを上回らないように、右を確認していく
	tmpX = x + 1;
	while (tmpX < width && this.table[y][tmpX] == -1) {
	    tmpX++;
	}
	if (tmpX < width) {
	    color[3] = this.table[y][tmpX];
	    coordinate[3][0] = tmpX;
	    coordinate[3][1] = y;
	}

	
	// 上下左右に同じ色があるかを判定()
	int baseColor = -2;
	boolean foundSame = false;
	boolean miss = true;

	// HPがまだあるなら、色を消していく
	if (this.HP > 0) {
	    // 色があるマスを基準にする
	    for (int i = 0; i < 4; i++) {
		foundSame = false;
		// 色を格納していないとき
		if (color[i] == -2) continue;
	    
		baseColor = color[i];
		for (int j = i + 1 ; j < 4; j++) {
		    if (color[j] != -2 && color[j] == baseColor) {
			if (this.table[coordinate[j][1]][coordinate[j][0]] != -1) {
			    this.table[coordinate[j][1]][coordinate[j][0]] = -1;
			    gui.setEmptyTile(coordinate[j][0], coordinate[j][1]);
			    this.score++;
			    foundSame = true;
			    miss = false;
			}
		    }
		}
		// １つ以上jのループで消しているとき
		if (foundSame && this.table[coordinate[i][1]][coordinate[i][0]] != -1) {
		    this.table[coordinate[i][1]][coordinate[i][0]] = -1;
		    gui.setEmptyTile(coordinate[i][0], coordinate[i][1]);
		    this.score++;
		    miss = false;
		}
	    }
	}

	
	// クリックしてもタイルを開けなかったときHPを-1
	if (miss && HP > 0) {
	    this.HP--;
	    if (HP >= 0) {
		System.out.println("HP: " + this.HP);
	    }
	    // HPが０になったら負け
	    if (this.HP == 0) {
		this.message();
		gui.lose();
		return;
	    }
	}
	
	// すべて空白なら勝ち
	if (checkWinCondition() == 1) {
	    this.HP = 0;
	    this.message();
	    gui.win();
	    return;
	}	    
	// タイルを開けなくなったら負け
	if (checkGameOverCondition()) {
	    this.HP = 0;
	    this.message();
	    gui.lose();
	    return;
	}
	
	// もしeasyで、クリックしてもタイルを開けなかったとき
	boolean teach = false;
	if (level && miss && HP > 0) {
	    for (int i = 0; i < height; i++) {
		for (int j = 0; j < width; j++) {
		    // タイルを開けることができる空白マスを教える
		    if (this.table[i][j] == -1 && checkTeach(i, j)) {
			System.out.println("Clickable: (x, y) = (" + j + ", " + i + ")" + "  [0-" + this.width + ", 0-" + this.height + "]");
			teach = true;
			break;
		    }
		}
		if (teach) break;
	    }
	}
    }
    // 勝ち負けを判定
    private int checkWinCondition(){
        /* ----- add here ----- */
	// 空白ではないマスを見つけたら-1を返す
	for (int i = 0; i < height; i++) {
	    for (int j = 0; j < width; j++) {
		if (this.table[i][j] != -1) {
		    return -1;
		}
	    }
	}
	// 全てEMPTYなら１を返す
	return 1;
    }
    // 消せる組があるかどうか
    private boolean checkGameOverCondition() {
	for (int y = 0; y < height; y++) {
	    for (int x = 0; x < width; x++) {
		// 空白マス以外は無視
		if (table[y][x] != -1) {
		    continue;
		}

		int[] color = new int[4];		
		// 初期化する
		for (int k = 0; k < color.length; k++) {
		    color[k] = -2;
		}
		
		// 上
		for (int k = y - 1; k >= 0; k--) {
		    if (this.table[k][x] != -1) {
			color[0] = this.table[k][x];
			break;
		    }
		}
		// 下
		for (int k = y + 1; k < height; k++) {
		    if (this.table[k][x] != -1) {
			color[1] = this.table[k][x];
			break;
		    }
		}
		// 左
		for (int k = x - 1; k >= 0; k--) {
		    if (this.table[y][k] != -1) {
			color[2] = this.table[y][k];
			break;
		    }
		}
		// 右
		for (int k = x + 1; k < width; k++) {
		    if (this.table[y][k] != -1) {
			color[3] = this.table[y][k];
			break;
		    }
		}

		// 同じ色が２つ以上あるか？
		for (int i = 0; i < 4; i++) {
		    for (int j = i + 1; j < 4; j++) {
			if (color[i] != -2 && color[i] == color[j]) {
			    // 消せる組があれば継続
			    return false;
			}
		    }
		}
	    }
	}
	// ゲームオーバー
	return true;
    }
		
    // 盤面をリセット
    public void reset(ColorTileGUI gui) {
        /* ----- add here ----- */
	System.out.println();
	System.out.println("RESET!!");
	
	for (int i = 0; i < height; i++) {
	    for (int j = 0; j < width; j++) {
	        this.table[i][j] = -2;
		gui.setEmptyTile(i, j);
	    }
	}
	// HPもリセット
	this.HP = this.defaultHP;
	this.score = 0;
	System.out.println("HP(reset): " + this.HP);
	this.initTable(gui);
    }

    // 指定された空白をクリックすると、タイルは開けるのか？
    public boolean checkTeach(int y, int x) {
	int[] color = new int[4];
	
	// 初期化する
	for (int k = 0; k < color.length; k++) {
	    color[k] = -2;
	}
		
	// 上
	for (int k = y - 1; k >= 0; k--) {
	    if (this.table[k][x] != -1) {
		color[0] = this.table[k][x];
		break;
	    }
	}
	// 下
	for (int k = y + 1; k < height; k++) {
	    if (this.table[k][x] != -1) {
		color[1] = this.table[k][x];
		break;
	    }
	}
	// 左
	for (int k = x - 1; k >= 0; k--) {
	    if (this.table[y][k] != -1) {
		color[2] = this.table[y][k];
		break;
	    }
	}
	// 右
	for (int k = x + 1; k < width; k++) {
	    if (this.table[y][k] != -1) {
		color[3] = this.table[y][k];
		break;
	    }
	}

	// 同じ色が２つ以上あるか？
	for (int i = 0; i < 4; i++) {
	    for (int j = i + 1; j < 4; j++) {
		if (color[i] != -2 && color[i] == color [j]) {
		    // 消せる組があればtrue
		    return true;
		}
	    }
	}
    
	// 消せない(次の空白へ)
	return false;
    }
	
    // スコアに対応するコメント
    public void message() {
	// スコア、コメントは１回しか表示しない
	if (this.scorePrint) {
	    return;
	}
	    
	System.out.print("Score: " + this.score + "/ " + (height * width - defaultEmptyCount) + ", ");
	if (this.score == height * width - defaultEmptyCount) {
	    System.out.println(" \"Congratulations!\" ");
	} else if (this.score >= (height * width - defaultEmptyCount) * (2.0 / 3)) {
	    System.out.println("  \"Great! Almost there!\" ");
	} else if (this.score >= (height * width - defaultEmptyCount) * (1.0 / 3)) {
	    System.out.println("  \"You can still do it!\" ");
	} else if (this.score == 0) {
	    System.out.println("  \"lol\" ");
	} else {
	    System.out.println(" \"That was on pupose, right?\" ");
	}
	this.scorePrint = true;
    }
}
