<script type="text/javascript">
    const storageKey = "lotteryCode";
    const storag = window.localStorage;

    if (storag && storag[storageKey] && document.URL.indexOf("/viewtopic.php?id") !== -1) {
        $(function() {
            $("#main-reply").val(storag[storageKey].replace(/\[br\]/gim, "\n"));
            delete storag[storageKey];

            $("#post").prepend('<div class="lottery-message">Данные из лотереи вставлены!</div>');

            // Удаляем сообщение через 3 секунды
            setTimeout(() => {
                $(".lottery-message").remove();
            }, 3000);
        });
    }
</script>
