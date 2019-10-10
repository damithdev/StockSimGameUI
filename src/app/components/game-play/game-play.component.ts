import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router'
import Chart from 'chart.js';
import { GamePlayService } from 'src/app/services/Game-Play/game-play.service';
import { environment } from 'src/environments/environment';
import { take } from 'rxjs/operators';

declare var $: any

@Component({
  selector: 'app-game-play',
  templateUrl: './game-play.component.html',
  styleUrls: ['./game-play.component.scss']
})
export class GamePlayComponent implements OnInit, OnDestroy {

  //Player Full Name & Username
  playerUserName: String = ''
  playerName: String = ''

  //Match Details
  matchDetails: any = {}

  //Method Variables
  mvGameStartInterval: any

  //Share Market
  sectors: any = []
  sectosPreviewData = []
  purchaseModalData = { index: 0, data: [], style: '', sectorName: '' }
  sectorSubData = { stockName: '', stocksQty: 0, ratePerQty: 0 };
  puchaseModalTotal: number = 0
  mPurchaseStockQuantity: number = 0

  //Your Transactions
  playerStartFrom: number = 1000
  playerCurrentIncome: number = 0
  playerTransactions: any = []
  playerTotal: number = this.playerStartFrom

  //Marquee Text Message
  marqueeMessage1: String = 'Try to earn more money by selling your shares'
  marqueeMessage2: String = ''
  marqueeMessage3: String = ''

  //Your Assets
  yourAssets: any = []
  sellModalData = { index: 0, sectorName: '', data: [], style: '' }
  yourAssetSubData = { index: 0, yourStocks: 0, yourStockRate: 0, yourStockName: '' }
  mSellingRate: any = 0
  mSellingStarted: boolean = false

  //Other Player Selling - Buy from other players
  otherPlayerMarket = []
  selectedPlayerMarket = { playerName: '', sectorName: '', shareHolders: [], index: 0 }
  selectedPlayerStockRate = { stocksQty: 0, ratePerQty: 0, index: 0, stockName: '', sellingStart: false }
  mQtyBuyingFromOtherPlayer: number = 0
  otherPlayerMarketTotal: number = 0
  selectTabWhenOpenFromOtherPlayerModal: String = ''

  //Chart
  datasets: any = []

  //Game data
  gameTurn: number = 1

  gameTurnTime: number = 1
  gameTime: number = 2
  timerMns: number = 0
  timerSecs: number = 0

  gameStartTimeOut: number = 5

  //remove me Later
  tempData = []

  stockMarketStatisticsChart = []

  quitGameToolTip: String = 'If you quit, the game will stop'

  //Waiting Modal
  waitingPlayers: any = []
  gameHosterDetail = { fullName: '', shortName: '' }

  //Event Source
  eventSource: any = EventSource
  connectedPlayerCounter = 0


  constructor(private router: Router, private gamePlayService: GamePlayService) {

  }

  ngOnInit() {
    this.checkSession("User")
    this.initValuesFromLocalStorage()

    this.initChartData()
    this.initWaitingModal()

    //Initialize data
    this.initSectors()
    this.initYourAssets()
    this.marqueeYourItemSellingRate()

    this.initOthersDetails()

    this.handleServiceError('/game-play', false)
  }

  ngOnDestroy() {
    this.eventSource.removeEventListener
  }

  initValuesFromLocalStorage() {

    //Full Name & Username
    var userDetails = JSON.parse(localStorage.getItem("User"))
    if (userDetails !== null) {
      //Get Username
      this.playerUserName = userDetails.username
      //Get Full Name
      this.playerName = userDetails.fullName
    }

    //Match Details - match ID & hoster
    var matchDetails = JSON.parse(localStorage.getItem('MATCH'))
    if (matchDetails !== null) {
      this.matchDetails = {
        matchId: parseInt(matchDetails.matchId),
        hoster: matchDetails.hoster
      }
    }

  }

  //Share Market

  initSectors() {

    this.sectors = [
      {
        sectorName: 'Finance',
        style: 'info',
        previewData: {},
        data: []
      },
      {
        sectorName: 'Technology',
        style: 'success',
        previewData: {},
        data: []
      },
      {
        sectorName: 'Consumer Service',
        style: 'primary',
        previewData: {},
        data: []
      },
      {
        sectorName: 'Manufaturing',
        style: 'rose',
        previewData: {},
        data: []
      }
    ]

    this.initSectorsPreviewData()

  }

  initSectorsPreviewData() {
    this.sectors.forEach((item, index) => {

      this.sectors[index].previewData = {
        totalStockQuantity: item.data.map(item => item.stocksQty).reduce((x, y) => {
          return x + y
        }),
        averageStockRate: ((item.data.map(item => item.ratePerQty).reduce((x, y) => {
          return x + y
        })) / item.data.length).toFixed(1)
      }

    });
  }

  showPurchaseModal(item, index) {

    this.setSectorSubData(item.data[0])
    this.purchaseModalData =
      {
        index: index,
        sectorName: item.sectorName,
        data: item.data,
        style: item.style
      }

    $('#modalPurchaseStock').modal('show')
  }

  setSectorSubData(data) {

    this.mPurchaseStockQuantity = 0
    this.puchaseModalTotal = 0

    this.sectorSubData = {
      stockName: data.stockName,
      stocksQty: data.stocksQty || 0,
      ratePerQty: data.ratePerQty || 0
    }
  }

  calculatePurchaseTotal(rate) {
    this.puchaseModalTotal = Math.round(this.mPurchaseStockQuantity * rate)
  }

  makePurchase(sectorSubData, index) {

    var stockIndex = this.sectors[index].data.findIndex(item => item.stockName == sectorSubData.stockName)
    //this.sectors[index].data[stockIndex].stocksQty = (sectorSubData.stocksQty - this.mPurchaseStockQuantity)

    //this.initSectorsPreviewData()

    var record = {
      username: this.playerUserName,
      hash: this.matchDetails.matchId.toString(),
      turn: this.gameTurn.toString(),
      sector: this.sectors[index].sectorName,
      stockName: sectorSubData.stockName,
      status: "PURCHASED",
      qty: this.mPurchaseStockQuantity.toString(),
      cps: sectorSubData.ratePerQty.toString(),
      total: this.puchaseModalTotal.toString(),
      income: '0'
    }

    this.playerTotal = this.playerTotal - this.puchaseModalTotal

    this.gamePlayService.purchaseStock(record).subscribe(response => {
      if (JSON.parse(response.toString())['status'] === environment.SUCCESS) {
        this.pushToPlayerTransactions(record)
        this.initSectorsPreviewData()
      }
    })

    this.mPurchaseStockQuantity = 0
    this.puchaseModalTotal = 0

    this.updateYourAssets(record, index)

    $('#modalPurchaseStock').modal('hide')
  }


  //Your Transactions

  pushToPlayerTransactions(item) {

    if (item.status === "SOLD") {
      item.income = parseFloat(item.income) + parseFloat(item.total)

      this.playerCurrentIncome = this.playerTransactions
        .map(item => item.income)
        .reduce((i1, i2) => { return parseFloat(i1) + parseFloat(i2) })

    } else {
      item.income = parseFloat(item.income) - parseFloat(item.total)
    }

    this.playerTransactions.unshift(item)
  }


  //Your Assets

  initYourAssets() {
    this.yourAssets = [
      {
        sectorName: 'Consumer Service',
        style: 'bg-primary',
        sellingRate: 0,
        previewData: {},
        data: [
          {
            stockName: 'Uniliver',
            stocksQty: 150,
            ratePerQty: 75,
            sellingRate: 70,
            sellingStart: false
          },
          {
            stockName: 'Coca Cola',
            stocksQty: 100,
            ratePerQty: 125,
            sellingRate: 110,
            sellingStart: false
          },
          {
            stockName: 'Hemas',
            stocksQty: 200,
            ratePerQty: 225,
            sellingRate: 200,
            sellingStart: false
          }
        ]

      }, {
        sectorName: 'Finance',
        style: 'bg-info',
        previewData: {},
        data: [
          {
            stockName: 'Citi Bank',
            stocksQty: 780,
            ratePerQty: 500,
            sellingRate: 450,
            sellingStart: false
          },
          {
            stockName: 'HSBC',
            stocksQty: 400,
            ratePerQty: 125,
            sellingRate: 115,
            sellingStart: false
          },
          {
            stockName: 'Commercial Bank',
            stocksQty: 350,
            ratePerQty: 110,
            sellingRate: 100,
            sellingStart: false
          }
        ]

      },
      {
        sectorName: 'Manufaturing',
        style: 'bg-rose',
        sellingRate: 0,
        previewData: {},
        data: [
          {
            stockName: 'Mercedez',
            stocksQty: 70,
            ratePerQty: 75,
            sellingRate: 60,
            sellingStart: false
          },
          {
            stockName: 'Toyota',
            stocksQty: 100,
            ratePerQty: 60,
            sellingRate: 45,
            sellingStart: false
          },
          {
            stockName: 'General Motors',
            stocksQty: 20,
            ratePerQty: 300,
            sellingRate: 290,
            sellingStart: false
          }
        ]

      }, {
        sectorName: 'Technology',
        style: 'bg-success',
        sellingRate: 0,
        previewData: {},
        data: [
          {
            stockName: 'Google',
            stocksQty: 50,
            ratePerQty: 75,
            sellingRate: 75,
            sellingStart: false
          },
          {
            stockName: 'Facebook',
            stocksQty: 100,
            ratePerQty: 125,
            sellingRate: 120,
            sellingStart: false
          },
          {
            stockName: 'Yahoo',
            stocksQty: 33,
            ratePerQty: 89,
            sellingRate: 79,
            sellingStart: false
          },
          {
            stockName: 'Microsot',
            stocksQty: 20,
            ratePerQty: 225,
            sellingRate: 220,
            sellingStart: false
          }
        ]

      }
    ]

    console.log('hello')
    console.log(this.yourAssets)
    this.initYourAssetPreviewData()
  }

  initYourAssetPreviewData() {

    this.yourAssets.forEach((item, index) => {

      var totalAssets = item.data.map(item => item.stocksQty).reduce((x, y) => {
        return x + y
      })

      var totalAssetsValue = item.data.map(item => item.stocksQty * item.ratePerQty).reduce((x, y) => {
        return x + y
      })


      this.yourAssets[index].previewData = {
        totalStockQuantity: totalAssets,
        averageStockRate: totalAssetsValue
      }

    });
  }

  updateYourAssets(data, index) {

    var stockHolderPosition = this.yourAssets[index].data.findIndex(item => item.stockName == data.stockName)

    if (stockHolderPosition == -1) {
      this.yourAssets[index].data.push({
        stockName: data.stockName,
        stocksQty: data.qty,
        ratePerQty: data.cps,
        sellingRate: 0,
        sellingStart: false
      })

    } else {
      var yourCurrentStock = this.yourAssets[index].data[stockHolderPosition].stocksQty

      this.yourAssets[index].data[stockHolderPosition].stocksQty = yourCurrentStock + data.qty
      this.yourAssets[index].data[stockHolderPosition].ratePerQty = yourCurrentStock + data.cps
    }

  }

  showSellingRateModal(item, index) {

    this.sellModalData = {
      index: index,
      sectorName: item.sectorName,
      style: item.style.replace('bg-', ''),
      data: item.data
    }

    this.setSellYourStockSubData(item.data[0] || { data: { stocksQty: 0, ratePerQty: 0 } }, 0)
    $('#modalSellStock').modal('show')
    this.mSellingRate = 0

  }

  setSellYourStockSubData(subData, index) {
    this.yourAssetSubData = {
      index: index,
      yourStocks: subData.stocksQty,
      yourStockRate: subData.ratePerQty,
      yourStockName: subData.stockName
    }

    this.mSellingRate = 0
  }

  saveSellingRate(item) {

    var stockHolderPosition = this.yourAssetSubData.index
    this.yourAssets[item.index].data[stockHolderPosition].sellingRate = parseFloat(this.mSellingRate)
    this.yourAssets[item.index].data[stockHolderPosition].sellingStart = this.mSellingStarted

    this.marqueeYourItemSellingRate()
    $('#modalSellStock').modal('hide')

  }

  onChangeSellingStatus(item) {
    this.yourAssets[item.index].sellingStart = this.mSellingStarted
  }


  //Other Player Selling - Buy from other players

  calculateOtherPlayersBuyingTotal(rate) {
    this.otherPlayerMarketTotal = Math.round(this.mQtyBuyingFromOtherPlayer * rate)
  }

  //------- this is a tempory method ------- //
  initOthersDetails() {

    this.otherPlayerMarket = [
      {
        playerName: 'Jimmy',
        previewData: { finance: 500, technology: 300, consumerService: 200, manufaturing: 300 },
        finance: [
          {
            stockName: 'Google',
            stocksQty: 50,
            sellingRate: 75,
            sellingStart: false
          },
          {
            stockName: 'Facebook',
            stocksQty: 50,
            sellingRate: 34,
            sellingStart: true
          },
          {
            stockName: 'Yahoo',
            stocksQty: 50,
            sellingRate: 12,
            sellingStart: true
          }
        ],
        technology: [
          {
            stockName: 'Google',
            stocksQty: 50,
            sellingRate: 0,
            sellingStart: false
          },
          {
            stockName: 'Facebook',
            stocksQty: 50,
            sellingRate: 0,
            sellingStart: true
          },
          {
            stockName: 'Yahoo',
            stocksQty: 50,
            sellingRate: 0,
            sellingStart: true
          }
        ],
        consumerService: [
          {
            stockName: 'Google',
            stocksQty: 50,
            sellingRate: 0,
            sellingStart: true
          },
          {
            stockName: 'Facebook',
            stocksQty: 50,
            sellingRate: 0,
            sellingStart: true
          },
          {
            stockName: 'Yahoo',
            stocksQty: 50,
            sellingRate: 0,
            sellingStart: true
          }
        ],
        manufaturing: [
          {
            stockName: 'Google',
            stocksQty: 50,
            sellingRate: 0,
            sellingStart: false
          },
          {
            stockName: 'Facebook',
            stocksQty: 50,
            sellingRate: 0,
            sellingStart: false
          },
          {
            stockName: 'Yahoo',
            stocksQty: 50,
            sellingRate: 0,
            sellingStart: false
          }
        ]
      }

    ]


  }

  openBuyFromOthersModal(item, filteredItem, sectorName, index) {

    this.selectedPlayerMarket = {
      playerName: item.playerName,
      sectorName: sectorName,
      shareHolders: filteredItem,
      index: index
    }

    var sellingAvailableStockIndex = this.selectedPlayerMarket.shareHolders.findIndex(item => item.sellingStart == true)
    var data = this.selectedPlayerMarket.shareHolders[sellingAvailableStockIndex]

    if (data != undefined) {
      this.setStockData(data, index)
      $('#modalBuyFromOtherPlayers').modal('show')
    } else {
      $('#playerNotReadyToSell').modal('show')
    }

    this.clearPreviousTabDetail()

  }

  clearPreviousTabDetail() {
    this.mQtyBuyingFromOtherPlayer = 0
    this.otherPlayerMarketTotal = 0
  }

  setStockData(data, index) {

    if (data.sellingStart) {
      this.selectedPlayerStockRate = {
        stocksQty: data.stocksQty,
        ratePerQty: data.sellingRate,
        stockName: data.stockName,
        sellingStart: data.sellingStart,
        index: index
      }
    }

  }

  makePurchaseFromOtherPlayer() {

    var record = {
      turn: this.gameTurn,
      sector: this.selectedPlayerMarket.sectorName,
      stockName: this.selectedPlayerStockRate.stockName,
      status: "PURCHASED",
      qty: this.mQtyBuyingFromOtherPlayer,
      cps: this.selectedPlayerStockRate.ratePerQty,
      total: this.otherPlayerMarketTotal,
      income: 0
    }

    this.updateYourAssets(record, this.selectedPlayerStockRate.index)
    this.pushToPlayerTransactions(record)
    this.playerTotal = this.playerTotal - this.otherPlayerMarketTotal

  }



  //Init Chart

  // Finance - 23c2d5, Technology - 62b766, Consumer Service - a644b9, Manufacturing - e83c77

  initChartData() {

    var games = []

    this.datasets = [
      {
        label: 'Consumer Service',
        data: [],
        fill: false,
        backgroundColor: "#a644b9",
        borderColor: "#a644b9",
        borderWidth: 2
      }, {
        label: 'Finance',
        data: [],
        fill: false,
        backgroundColor: "#23c2d5",
        borderColor: "#23c2d5",
        borderWidth: 2
      }, {
        label: 'Manufacturing',
        data: [],
        fill: false,
        backgroundColor: "#e83c77",
        borderColor: "#e83c77",
        borderWidth: 2
      },
      {
        label: 'Technology',
        data: [],
        fill: false,
        backgroundColor: "#62b766",
        borderColor: "#62b766",
        borderWidth: 2
      },
    ]

    this.autoUpdateChart()
    this.reinitChart(games)
  }

  reinitChart(games) {
    this.stockMarketStatisticsChart = new Chart('stockStaistics', {
      type: 'line',
      data: {
        labels: games,
        datasets: this.datasets
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: 'Statistics History in Stock Market Simulation'
        },
        scales: {
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Avg. Rates in LKR'
            },
            ticks: {
              beginAtZero: true
            }
          }],
          xAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Game Turns'
              },
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    })
  }

  updateChart() {
    this.datasets.push(
      {
        label: 'Apple',
        data: [1100, 100, 1300, 1600, 300, 500, 50, 900],
        fill: false,
        backgroundColor: "#00bcd4",
        borderColor: "#00bcd4",
        borderWidth: 2
      }
    )

    this.reinitChart(['Turn 1', 'Turn 2', 'Turn 3', 'Turn 4', 'Turn 5', 'Turn 6', 'Turn 7', 'Turn 8'])
  }

  autoUpdateChart() {

    this.sectors.forEach((item, index) => {
      this.datasets[index].data.push(item.previewData.averageStockRate)
    })

    var games = []

    for (var i = 1; i <= this.gameTurn; i++) {
      games.push("Turn " + i)
    }

    this.reinitChart(games)
  }

  //Marquee

  marqueeYourItemSellingRate() {

    this.marqueeMessage3 = ''

    this.yourAssets.forEach((item, index) => {

      this.marqueeMessage3 += item.sectorName + " - "

      this.yourAssets[index].data.forEach((item, index) => {
        this.marqueeMessage3 += item.stockName + " at " + item.sellingRate + ' LKR, '
      })

      this.marqueeMessage3 = this.marqueeMessage3.slice(0, -2) + ' | '

    });

    this.marqueeMessage3 = this.marqueeMessage3.slice(0, -2) + ''

  }


  //Check Session
  checkSession(key) {
    if (localStorage.getItem(key) === null || localStorage.getItem(key) === '') {
      this.router.navigate(["/landing"])
    }
  }

  //Quit Game
  quitGame() {
    this.router.navigate(['menu'])
  }

  //Server Error
  handleServiceError(router, boolValue) {
    localStorage.setItem("SERVICE_ERROR", JSON.stringify(
      {
        currentRout: router,
        showPage: boolValue
      }
    ))
  }

  //Game Waiting Screen

  initWaitingModal() {
    // $('#modalWaitUnitllOtherPlayers').modal('show')
    this.ifGameHoster()
    this.openStreaming()

    this.ifGameHoster()
    setTimeout(() => {
      this._listenToStream()
    }, 3500)

    setTimeout(() => {
      this.startMatch()
    }, 3800)

  }

  openStreaming() {

    this.gamePlayService.requestGameStream(
      {
        "username": this.playerUserName,
        "hash": this.matchDetails.matchId
      }).pipe(take(1)).subscribe()
  }

  _listenToStream() {

    var url = environment.REQUEST_STREAM + '?username=' + encodeURI(this.playerUserName.toString()) + '&hash=' + parseInt(this.matchDetails.matchId)

    this.eventSource = new EventSource(url)
    this.eventSource.addEventListener('message', (event) => {

      console.log(event)

      if (event.data !== 'l') {
        var response = JSON.parse(event.data)

        //Waiting Players Details
        if (response.status == environment.WAITING_FOR_PLAYERS) {
          this.waitingPlayer(response)
          this.connectedPlayerCounter = response.playerCount
          console.log("0x7001 - Waiting Players")
          console.log(response)
        }

        //Share Market Data
        if (response.status == environment.SECTOR_DATA) {
          this.feedSectorData(response)
          console.log("0x7002 - Sector Data")
          console.log(response)
          $("#modalWaitUnitllOtherPlayers").modal('hide')
        }

        if (response.status == environment.GAME_TURN) {
          this.gameTurn = response.turn
          console.log("0x7005 - Turn")
          console.log(response)
        }

      }
    })

  }

  waitingPlayer(data) {

    if (!this.matchDetails.hoster) {

      var hoster = data.hoster

      this.gameHosterDetail = {
        fullName: hoster,
        shortName: hoster.charAt(0) + hoster.charAt(hoster.indexOf(' ') + 1)
      }
      console.log("You are not the hoster")
    }

    this.waitingPlayers = []

    data.players.forEach((item, index) => {

      this.waitingPlayers.push({
        circleName: item.charAt(0) + item.charAt(item.indexOf(' ') + 1),
        name: item
      })

    })

  }

  ifGameHoster() {

    if (this.matchDetails.hoster) {
      this.gameHosterDetail = {
        fullName: this.playerName.toString(),
        shortName: this.playerName.charAt(0) + this.playerName.charAt(this.playerName.indexOf(' ') + 1)
      }
    }
  }

  //Game Start
  startMatch() {

    var reqBody = {
      username: this.playerUserName,
      hash: (this.matchDetails.matchId).toString()
    }

    // if (environment.MIN_PLAYER_COUNT <= this.connectedPlayerCounter) {
    this.gamePlayService.startGame(reqBody).pipe(take(1)).subscribe()
    console.log("Start Game Request Sent")
    //}
  }

  feedSectorData(data) {
    this.sectors = data['shareMarket']
    console.log(data)
    $("#modalWaitUnitllOtherPlayers").modal('hide')
    this.initSectorsPreviewData()
    this.autoUpdateChart()
  }




}
