const API_KEY = '6b6b6865467c41968d4bb4a9bea4bb76';
const API_URL = `https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=${API_KEY}&Type=json&pIndex=1&pSize=100&ATPT_OFCDC_SC_CODE=M10&SD_SCHUL_CODE=8092033`;

document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date-input');
    const menuList = document.getElementById('menu-list');
    const loading = document.getElementById('loading');
    const todayMenu = document.getElementById('today-menu');

    function renderMenus(menus) {
        menuList.innerHTML = '';
        if (!menus || menus.length === 0) {
            menuList.innerHTML = '<li>해당 날짜의 급식 정보가 없습니다.</li>';
            todayMenu.innerHTML = '<div class="menu-item">해당 날짜의 급식 정보가 없습니다.</div>';
            return;
        }
        menus.forEach(menu => {
            const li = document.createElement('li');
            li.className = 'menu-item';
            li.innerHTML = `
                <div class="menu-title">${menu.ddishNm.replace(/<br\/>/g, ', ')}</div>
                <div class="menu-date">${menu.mlsvYmd.slice(0,4)}-${menu.mlsvYmd.slice(4,6)}-${menu.mlsvYmd.slice(6,8)}</div>
            `;
            menuList.appendChild(li);
        });
        // 오늘의 급식은 첫 번째 메뉴로 표시
        const first = menus[0];
        todayMenu.innerHTML = `
            <div class="menu-item">
                <div class="menu-title">오늘의 급식</div>
                <div class="menu-date">${first.mlsvYmd.slice(0,4)}-${first.mlsvYmd.slice(4,6)}-${first.mlsvYmd.slice(6,8)}</div>
                <div class="menu-title">${first.ddishNm.replace(/<br\/>/g, ', ')}</div>
            </div>
        `;
    }

    async function fetchMenuByDate(dateStr) {
        loading.style.display = 'block';
        menuList.innerHTML = '';
        todayMenu.innerHTML = '';
        try {
            const url = `${API_URL}&MLSV_YMD=${dateStr}`;
            const res = await fetch(url);
            const data = await res.json();
            const rows = data.mealServiceDietInfo?.[1]?.row || [];
            renderMenus(rows);
        } catch (e) {
            menuList.innerHTML = '<li>오류가 발생했습니다. 잠시 후 다시 시도해주세요.</li>';
            todayMenu.innerHTML = '<div class="menu-item">오류가 발생했습니다.</div>';
        } finally {
            loading.style.display = 'none';
        }
    }

    if (dateInput) {
        dateInput.addEventListener('change', () => {
            const dateStr = dateInput.value.replace(/-/g, '');
            fetchMenuByDate(dateStr);
        });
        // 페이지 로드시 오늘 날짜로 자동 조회
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.value = `${yyyy}-${mm}-${dd}`;
        fetchMenuByDate(`${yyyy}${mm}${dd}`);
    }
});