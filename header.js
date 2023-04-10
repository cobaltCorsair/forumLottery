<!-- Лотерея скрипт -->
<script src="https://forumstatic.ru/files/0019/d4/16/17023.js?v=3" defer></script>
<script>
	window.addEventListener("DOMContentLoaded", () => {
		lotteryApp.init({
		    // тема форума, в которую пользователи будут писать результаты
			forumThreadUrl: "https://scrirtstest.rusff.me/viewtopic.php?id=5",
		});
		// Разрешенные группы пользователей (амс, игроки)
		const allowedGroups = [1, 2, 5];
		if (allowedGroups.includes(GroupID)) {
			lotteryApp.checkAndDisplayImage();
		}
	});
	if (GroupID === 1) {
		document.getElementById("addLotteryItemButton").setAttribute("data-group-id", "1");
		document.getElementById("lotteryItemsList").setAttribute("data-group-id", "1");
		document.getElementById("toggleLotteryItemsList").setAttribute("data-group-id", "1");
	}
</script>