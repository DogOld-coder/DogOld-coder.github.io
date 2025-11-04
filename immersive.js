document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("immersionCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    const starCount = 180;
    let stars = [];

    const resize = () => {
        width = canvas.clientWidth || canvas.parentElement.clientWidth;
        height = canvas.clientHeight || canvas.parentElement.clientHeight || 420;
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        generateStars();
    };

    const generateStars = () => {
        stars = Array.from({ length: starCount }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            z: Math.random() * 0.8 + 0.2,
            velocity: Math.random() * 0.6 + 0.2
        }));
    };

    const draw = () => {
        ctx.clearRect(0, 0, width, height);
        stars.forEach(star => {
            star.y += star.velocity;
            if (star.y > height) {
                star.y = -4;
                star.x = Math.random() * width;
            }
            const size = star.z * 2.2;
            ctx.beginPath();
            ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(111, 91, 255, ${0.35 * star.z})`;
            ctx.fill();
            ctx.closePath();
            ctx.beginPath();
            ctx.arc(star.x, star.y, size * 0.45, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(53, 243, 255, ${0.55 * star.z})`;
            ctx.fill();
        });
        requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
});
