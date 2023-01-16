
  let allCards = []

  const renderCards = (arr) => {
    let out = document.getElementById("out");
    out.innerHTML = "";
    let cardItem = "";

    arr.forEach((el) => {
      //разметка карточки
      const card = document.createElement("div");
      card.classList.add("card__item");
      out.appendChild(card);

      const cardItemInfo = document.createElement("div");
      cardItemInfo.classList.add("card__item-info");
      card.appendChild(cardItemInfo);

      const logo = document.createElement("img");
      logo.classList.add("card__logo");
      card.prepend(logo);
      logo.setAttribute("src", `${el.logo}`);

      const divCompany = document.createElement("div");
      cardItemInfo.appendChild(divCompany);

      const company = document.createElement("p");
      company.classList.add("company");
      divCompany.appendChild(company);
      company.innerHTML = `${el.company}`;

      const isNew = el.new;
      const isFeatured = el.featured;

      if (isNew) {
        const newVacancy = document.createElement("span");
        newVacancy.classList.add("vacancy__status");
        newVacancy.innerHTML = "NEW!";
        company.appendChild(newVacancy);

        if (isFeatured) {
          const featured = document.createElement("span");
          featured.classList.add("vacancy__status");
          featured.innerHTML = "FEATURED";
          company.appendChild(featured);
        }
      }

      const divPosition = document.createElement("div");
      cardItemInfo.appendChild(divPosition);

      const position = document.createElement("p");
      position.classList.add("position");

      divPosition.appendChild(position);
      position.innerHTML = `${el.position}`;

      const details = document.createElement("div");
      details.classList.add("details");
      cardItemInfo.appendChild(details);

      const postedAt = document.createElement("p");
      details.appendChild(postedAt);
      postedAt.innerHTML = `${el.postedAt}`;

      const contract = document.createElement("p");
      details.appendChild(contract);
      contract.innerHTML = `${el.contract}`;

      const location = document.createElement("p");
      details.appendChild(location);
      location.innerHTML = `${el.location}`;

      const options = document.createElement("div");
      options.classList.add("options");
      card.appendChild(options);

      const buttonRole = document.createElement("button");
      buttonRole.classList.add("btn");
      buttonRole.setAttribute("data-filter", buttonRole.textContent);
      options.appendChild(buttonRole);
      buttonRole.innerHTML = `${el.role}`;

      const buttonLevel = document.createElement("button");
      buttonLevel.classList.add("btn");
      buttonLevel.setAttribute("data-filter", buttonLevel.textContent);
      options.appendChild(buttonLevel);
      buttonLevel.innerHTML = `${el.level}`;

      const langArr = el.languages;
      langArr.forEach((elem) => {
        const buttonLangs = document.createElement("button");
        buttonLangs.classList.add("btn");
        buttonLangs.setAttribute("data-filter", elem.textContent);
        options.appendChild(buttonLangs);
        buttonLangs.innerHTML = elem;
      });

      const toolsArr = el.tools;
      toolsArr.forEach((elem) => {
        const buttonTools = document.createElement("button");
        buttonTools.classList.add("btn");
        buttonTools.setAttribute("data-filter", elem.textContent);
        options.appendChild(buttonTools);
        buttonTools.innerHTML = elem;
      });
    });
    out.insertAdjacentHTML("afterbegin", cardItem);
  };

  const getFilters = (filters) => {
    const result = []
    const btns = filters.querySelectorAll(".btn")
    Array.prototype.forEach.call(btns, btn => {
      result.push(btn.innerText)
    })
    return result
  }

  const filteredPositions = (positions, filters) => {
    const result = []
    positions.forEach(item => {
      const existProps = []
      const props = [...item.languages, ...item.tools, item.role, item.level, item.location]
      filters.forEach(filter => {
        if (props.includes(filter)) existProps.push(filter)
      })
      if (existProps.length === filters.length) {
        result.push(item)
      }
    })
    return result
  }

  const getInfo = async () => {
    const response = await axios
      .get("../data.json")
      .then((response) => {
        allCards = response.data;
        renderCards(allCards)

        const filterButtons = document.createElement("div");
        filterButtons.classList.add("filter__block");

        const filterButtonsDiv = document.createElement("div");
        const clearButtonDiv = document.createElement("div");

        filterButtonsDiv.classList.add("cards__filter");
        clearButtonDiv.classList.add("clear__block");

        filterButtons.appendChild(filterButtonsDiv);
        filterButtons.appendChild(clearButtonDiv);

        const clearBtn = document.createElement("button");
        clearBtn.classList.add("clear__button");
        clearBtn.innerText = "Clear";
        clearButtonDiv.appendChild(clearBtn);

        document.addEventListener("click", (e) => {
          if (!e.target.classList.contains("btn")) return
          out.insertAdjacentElement("beforebegin", filterButtons);
          filterButtons.style.display = "flex";

          const filterButton = document.createElement("div");
          filterButtonsDiv.appendChild(filterButton);
          filterButton.classList.add("filter__btn");

          const filter = e.target.innerText
          const existFilters = getFilters(filterButtons)
          if (!existFilters.includes(filter)) {

            const clone = e.target.cloneNode(true);
            filterButton.appendChild(clone);

            clone.classList.add("clone__btn");
            const close = document.createElement("div");
            close.classList.add("cl-btn-7");
            filterButton.appendChild(close);

            clone.insertAdjacentElement("afterend", close);
            clone.disabled = true;
            close.addEventListener("click", () => {
              clone.remove();
              close.remove();
            });
            clearBtn.addEventListener("click", () => {
              clone.remove();
              close.remove();
              filterButtons.style.display = "none";
            });
          }

          const filters = getFilters(filterButtons)
          const result = filteredPositions(allCards, filters)
          renderCards(result)
        })
      })
      .catch((error) => {
        console.error(error);
      });
  }
  getInfo();


  document.addEventListener("click", e => {
    if (!e.target.closest(".cl-btn-7")) return
    const filterButtons = document.querySelector(".filter__block")
    const filters = getFilters(filterButtons)
    const result = filteredPositions(allCards, filters)
    renderCards(result)
  })

  document.addEventListener("click", e => {
    if (!e.target.closest(".cl-btn-7")) return
    const filterButtons = document.querySelector(".filter__block")
    const filters = getFilters(filterButtons)
    if (filters.length > 0) return
    const clear = document.querySelector(".clear__button")
    const closeClick = new Event("click")
    clear.dispatchEvent(closeClick)
  })

  document.addEventListener("click", e => {
    if (!e.target.closest(".clear__button")) return
    const result = filteredPositions(allCards, [])
    renderCards(result)
  })
