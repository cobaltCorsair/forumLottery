const lotteryApp = {
	config: {
        forumThreadUrl: "",
		apiUrl: "https://protonbeam.ru/api.php",
        apiToken: "MybbLottery",															
	},
	
    init(config) {
        if (config) {
            this.config = { ...this.config, ...config };
		}
        this.bindEventListeners();
        this.loadLotteryItems();
	},
	
	getRandomInterval(minHours, maxHours) {
		return (Math.random() * (maxHours - minHours) + minHours) * 60 * 60 * 1000;
	},
	
	checkAndDisplayImage() {
		const lastDisplayTime = this.getCookie("last_display_time");
		const interval = this.getRandomInterval(1, 4);
		
		if (!lastDisplayTime || Date.now() - lastDisplayTime >= interval) {
			this.displayRandomImage();
			this.setCookie("last_display_time", Date.now(), { expires: interval });
			setTimeout(() => {
				const imageElement = document.querySelector(".lottery-image");
				if (imageElement) {
					document.body.removeChild(imageElement);
				}
			}, 60 * 1000);
		}
	},
	
	setCookie(name, value, options = {}) {
		options = {
			path: '/',
			...options,
		};
		
		if (options.expires instanceof Date) {
			options.expires = options.expires.toUTCString();
		}
		
		let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
		
		for (const optionKey in options) {
			updatedCookie += "; " + optionKey;
			const optionValue = options[optionKey];
			if (optionValue !== true) {
				updatedCookie += "=" + optionValue;
			}
		}
		
		document.cookie = updatedCookie;
	},
	
	getCookie(name) {
		const matches = document.cookie.match(new RegExp(
			"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
		));
		return matches ? decodeURIComponent(matches[1]) : undefined;
	},
	
	bindEventListeners() {
		document.getElementById("toggleLotteryItemsList").addEventListener("click", () => this.toggleLotteryItemsList());
		document.getElementById("addLotteryItemButton").addEventListener("click", () => this.togglePanel());
		document.getElementById("saveLotteryItemButton").addEventListener("click", () => this.saveLotteryItem());
		
		document.addEventListener("click", (event) => {
			if (event.target.classList.contains("lottery-image")) {
				this.displayPopup(event.target);
				} else if (event.target.id === "closeButton") {
				this.closePopup();
			}
		});
	},
	
	togglePanel() {
		const panel = document.getElementById("addLotteryItemPanel");
		panel.style.display = panel.style.display === "none" || !panel.style.display ? "block" : "none";
	},
	
	toggleLotteryItemsList() {
		const lotteryItemsList = document.getElementById("lotteryItemsList");
		const isHidden = lotteryItemsList.classList.contains("hidden");
		
		if (isHidden) {
			lotteryItemsList.classList.remove("hidden");
			lotteryItemsList.style.transform = "translateX(0)";
			} else {
			lotteryItemsList.classList.add("hidden");
			lotteryItemsList.style.transform = "translateX(-101%)";
		}
	},
	
	saveLotteryItem() {
		const imageUrl = document.getElementById("imageUrlInput").value;
		const description = document.getElementById("descriptionInput").value;
		
		if (imageUrl && description) {
			const newLotteryItem = { imageUrl, description };
			
			this.addLotteryItem(newLotteryItem, this.displayLotteryItem);
			
			document.getElementById("imageUrlInput").value = "";
			document.getElementById("descriptionInput").value = "";
			} else {
			alert("Пожалуйста, заполните все поля.");
		}
	},
	
	addLotteryItem(newItem, callback) {
		$.ajax({
			url: this.config.apiUrl,
			type: 'POST',
			dataType: 'json',
			data: JSON.stringify({
				method: "storage.get",
				token: this.config.apiToken,
				key: "lottery_data",
			}),
			contentType: 'application/json',
			success: (json) => {
				let lotteryData = [];
				if (json.response) {
					lotteryData = JSON.parse(json.response.storage.data["lottery_data"]);
				}
				lotteryData.push(newItem);
				this.createLotteryData(lotteryData);
				if (callback) {
					callback(newItem, lotteryData.length - 1);
				}
				
				this.updateDeleteButtons();
			},
		});
	
	},
	
	displayLotteryItem(item, index) {
		const listItem = document.createElement("div");
		listItem.classList.add("lottery-item");
		const imageElement = document.createElement("img");
		imageElement.src = item.imageUrl;
		imageElement.style.width = "50px";
		imageElement.style.height = "50px";
		listItem.appendChild(imageElement);
		
		const descriptionElement = document.createElement("span");
		descriptionElement.innerHTML = item.description;
		listItem.appendChild(descriptionElement);
		
		const deleteButton = document.createElement("button");
		deleteButton.innerHTML = "Удалить";
		deleteButton.addEventListener("click", () => {
			this.removeLotteryItem(index);
			listItem.remove();
		});
		listItem.appendChild(deleteButton);
		
		document.getElementById("lotteryItemsList").appendChild(listItem);
	},
	
	removeLotteryItem(itemToRemove) {
		$.ajax({
			url: this.config.apiUrl,
			type: 'POST',
			dataType: 'json',
			data: JSON.stringify({
				method: "storage.get",
				token: this.config.apiToken,
				key: "lottery_data",
			}),
			contentType: 'application/json',
			success: (json) => {
				if (json.response) {
					let lotteryData = JSON.parse(json.response.storage.data["lottery_data"]);
					lotteryData.splice(itemToRemove, 1);
					this.createLotteryData(lotteryData);
				}
			},
		});
	},
	
	loadLotteryItems() {
		$.ajax({
			url: this.config.apiUrl,
			type: 'POST',
			dataType: 'json',
			data: JSON.stringify({
				method: "storage.get",
				token: this.config.apiToken,
				key: "lottery_data",
			}),
			contentType: 'application/json',
			success: (json) => {
				if (json.response) {
					const lotteryData = JSON.parse(json.response.storage.data["lottery_data"]);
					lotteryData.forEach((item, index) => this.displayLotteryItem(item, index));
				}
			},
		});
	
	},
	
	createLotteryData(lotteryData) {
		$.ajax({
			url: this.config.apiUrl,
			type: 'POST',
			dataType: 'json',
			data: JSON.stringify({
				method: "storage.set",
				token: this.config.apiToken,
				key: "lottery_data",
				value: JSON.stringify(lotteryData),
			}),
			contentType: 'application/json',
			success: (json) => {
				console.log("Lottery data created");
			},
		});
	
	},
	
	displayRandomImage() {
		$.ajax({
			url: this.config.apiUrl,
			type: 'POST',
			dataType: 'json',
			data: JSON.stringify({
				method: "storage.get",
				token: this.config.apiToken,
				key: "lottery_data",
			}),
			success: (json) => {
				if (json.response) {
					const lotteryData = JSON.parse(json.response.storage.data["lottery_data"]);
					const randomIndex = Math.floor(Math.random() * lotteryData.length);
					const imageUrl = lotteryData[randomIndex].imageUrl;
					const imageElement = document.createElement("img");
					imageElement.src = imageUrl;
					imageElement.style.position = "absolute";
					
																							 
					const imageWidth = imageElement.width;
					const imageHeight = imageElement.height;
					const windowWidth = window.innerWidth;
					const windowHeight = window.innerHeight;
					
																																			   
					const maxLeft = windowWidth - imageWidth - 100;
					const maxTop = windowHeight - imageHeight - 100;
					
					const left = Math.random() * maxLeft + 50;
					const top = Math.random() * maxTop + 50;
					
	 
											 
					imageElement.style.left = left + "px";
					imageElement.style.top = top + "px";
					
					imageElement.classList.add("lottery-image");
					imageElement.setAttribute("data-index", randomIndex);
					
					document.body.appendChild(imageElement);
				}
			}
		});
	
	},
	
	redirectToForumThread(imageUrl, description) {
		const currentTime = new Date().toLocaleString();
		const bbCode = `[img]${imageUrl}[/img]\n${description}\nСобрано: ${currentTime}`;
		
		const storageKey = "lotteryCode";
		const storag = window.localStorage;
		if (storag) {
			storag[storageKey] = bbCode;
		}
		
		window.location.href = this.config.forumThreadUrl + '#post';
	},
	
	removeSelectedLotteryItem(index) {
		$.ajax({
			url: this.config.apiUrl,
			type: 'POST',
			dataType: 'json',
			data: JSON.stringify({
				method: "storage.get",
				token: this.config.apiToken,
				key: "lottery_data",
			}),
			contentType: 'application/json',
			success: (json) => {
				if (json.response) {
					let lotteryData = JSON.parse(json.response.storage.data["lottery_data"]);
					lotteryData.splice(index, 1);
					$.ajax({
						url: this.config.apiUrl,
						type: 'POST',
						dataType: 'json',
						data: JSON.stringify({
							method: "storage.set",
							token: this.config.apiToken,
							key: "lottery_data",
							value: JSON.stringify(lotteryData),
						}),
						contentType: 'application/json',
						success: (json) => {
							console.log("Lottery item removed");
						},
						error: function (xhr, textStatus, errorThrown) {
							console.log("Error: " + errorThrown);
						}
					});
				}
			},
			error: function (xhr, textStatus, errorThrown) {
				console.log("Error: " + errorThrown);
			}
		});
	},
	
	displayPopup(targetImage) {
		const popup = document.createElement("div");
		popup.id = "lottery-popup";
		popup.classList.add("popup-style");
		
		const collectButton = document.createElement("button");
		collectButton.id = "collectButton";
		collectButton.innerHTML = "Забрать";
		popup.appendChild(collectButton);
		
		collectButton.addEventListener("click", () => {
			const randomIndex = this.getSelectedLotteryItemIndex();
			
			$.ajax({
				url: this.config.apiUrl,
				type: 'POST',
				dataType: 'json',
				data: JSON.stringify({
					method: "storage.get",
					token: this.config.apiToken,
					key: "lottery_data",
				}),
				success: (json) => {
					if (json.response) {
						const lotteryData = JSON.parse(json.response.storage.data["lottery_data"]);
						const selectedLotteryItem = lotteryData[randomIndex];
						
						this.removeSelectedLotteryItem(randomIndex);
						
						this.redirectToForumThread(selectedLotteryItem.imageUrl, selectedLotteryItem.description);
						
						this.closePopup();
					}
				}
			});
		});
		
		const closeButton = document.createElement("button");
		closeButton.id = "closeButton";
		closeButton.innerHTML = "Закрыть";
		closeButton.style.marginLeft = "10px";
		popup.appendChild(closeButton);
		
		setTimeout(() => {
			const popupWidth = popup.offsetWidth;
			const imageRect = targetImage.getBoundingClientRect();
			popup.style.position = "absolute";
			popup.style.left = (imageRect.left + window.pageXOffset - (popupWidth / 2) + (imageRect.width / 2)) + "px";
			popup.style.top = (imageRect.top + imageRect.height + window.pageYOffset) + "px";
		}, 0);
		
		document.body.appendChild(popup);
		const randomIndex = parseInt(targetImage.getAttribute("data-index"), 10);
		targetImage.setAttribute("data-index", randomIndex);
	},
	
	closePopup() {
		const popup = document.getElementById("lottery-popup");
		if (popup) {
			document.body.removeChild(popup);
		}
	},
	
	getSelectedLotteryItemIndex() {
		const targetImage = document.querySelector(".lottery-image");
		return parseInt(targetImage.getAttribute("data-index"), 10);
	},
	
	updateDeleteButtons() {
		const deleteButtons = document.querySelectorAll(".lottery-item button");
		deleteButtons.forEach((button, index) => {
			button.removeEventListener("click", button.clickHandler);
			button.clickHandler = () => { 
				this.removeLotteryItem(index);
				button.parentElement.remove();
			};
			button.addEventListener("click", button.clickHandler); 
		});
	},
	
};