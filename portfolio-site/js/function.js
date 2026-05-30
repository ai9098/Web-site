/**
 * 要素が画面内に入ったかどうかを判定する関数(監視対象, タイミング)
 * @param target {HTMLElement} 監視対象の要素 
 * @param options {IntersectionObserverInit} IntersectionObserverオプション
 */
const setupIntersectionObserver = (target, options) => {
    const callback = (entries, observer) => {
        entries.forEach((entry) => {
            // 監視範囲に入ったかどうかを判定
            if (entry.isIntersecting) {
                // トリガーされた要素にisActiveクラス(CSS)を追加
                entry.target.classList.add("isActive");
                // アニメーションは一度だけなので、トリガーしたら監視を解除する
                observer.unobserve(entry.target);
            }
        });
    };
    // 監視装置を作成
    const observer = new IntersectionObserver(callback, options);
    // 監視開始
    observer.observe(target);
};

/** 
 * 画面下部で発火するスクロールトリガー
 * @param target {HTMLElement} トリガーしたい要素
 */
const setupAdvanced = (target) => {
    const options = {
        root: null, // 画面全体を基準にする
        rootMargin: "-80% 0px -20px 0px", // この範囲に入ったかどうか
        threshold: 0,
    };
    setupIntersectionObserver(target, options);
};

// setupAdvancedを呼ぶ
const targets = document.querySelectorAll(".scroll");
targets.forEach((target) => {
    setupAdvanced(target);
});


/** 
 * project.html用のスクロールトリガー
 */
const setupAdvanced2 = (target) => {
    const options = {
        root: null, // 画面全体を基準にする
        rootMargin: "0px", // この範囲に入ったかどうか
        threshold: 0,
    };
    setupIntersectionObserver(target, options);
};

// setupAdvanced2を呼ぶ
const targets2 = document.querySelectorAll(".scroll2");
targets2.forEach((target) => {
    setupAdvanced2(target);
});


// スライド用
const targets3 = document.querySelectorAll(".slide");

const observer3 = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
});

targets3.forEach((target) => {
    observer3.observe(target);
});


// モーダルを表示するボタンを取得
const modalOpens = document.querySelectorAll('.modalOpen');

modalOpens.forEach(link => {
    link.addEventListener('click', (event) => {
        // aタグのページ移動を止める
        event.preventDefault();

        // data-modal の値を取得
        const modalId = link.dataset.modal;
        // 対応するモーダル取得
        const modal = document.getElementById(modalId);
        // モーダル表示
        modal.style.display = 'block';

        // 閉じるボタン取得
        const closeBtn = modal.querySelector('.modalClose');
        // 閉じる
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        // 外側(黒背景)クリックで閉じる
        modal.addEventListener('click', (event) => {

            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
});
