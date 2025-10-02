import { Component, computed, signal, OnInit, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';

// Interfaces
interface JobCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  workType: string;
  skills: string[];
  postedDate: string;
  isHot?: boolean;
  isPro?: boolean;
}

interface SearchForm {
  keyword: string;
  location: string;
}

interface JobStats {
  activeJobs: number;
  newJobsToday: number;
  companies: number;
}

interface Location {
  label: string;
  value: string;
}

@Component({
  selector: 'app-home',
  imports: [FormsModule],
  templateUrl: './home.html',
  styles: ``,
})
export class Home implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private resizeListener?: () => void;
  // UI State
  protected uiState = signal({
    loadingMore: false,
    searchLoading: false,
  });

  // Search Form
  protected searchForm: SearchForm = {
    keyword: '',
    location: ''
  };

  // Categories
  protected currentCategoryIndex = signal(0);
  protected jobCategories: JobCategory[] = [
    { id: '1', name: 'Kinh doanh/Bán hàng', icon: '💼', count: 15420 },
    { id: '2', name: 'Marketing/PR/Quảng cáo', icon: '📢', count: 8950 },
    { id: '3', name: 'Chăm sóc khách hàng', icon: '🎧', count: 6780 },
    { id: '4', name: 'Nhân sự/Hành chính/Pháp chế', icon: '👥', count: 5430 },
    { id: '5', name: 'Công nghệ Thông tin', icon: '💻', count: 12340 },
    { id: '6', name: 'Lao động phổ thông', icon: '🔧', count: 9870 },
    { id: '7', name: 'Kế toán/Kiểm toán', icon: '📊', count: 4560 },
    { id: '8', name: 'Tài chính/Đầu tư', icon: '💰', count: 3210 },
    { id: '9', name: 'Thiết kế/Sáng tạo', icon: '🎨', count: 2890 },
    { id: '10', name: 'Y tế/Dược phẩm', icon: '⚕️', count: 1980 }
  ];

  // Job Stats
  protected jobStats: JobStats = {
    activeJobs: 55416,
    newJobsToday: 2856,
    companies: 15240
  };

  // Popular Locations
  protected popularLocations: Location[] = [
    { label: 'Hà Nội', value: 'ha-noi' },
    { label: 'TP. HCM', value: 'ho-chi-minh' },
    { label: 'Đà Nẵng', value: 'da-nang' },
    { label: 'Miền Bắc', value: 'mien-bac' },
    { label: 'Miền Nam', value: 'mien-nam' }
  ];

  // Filter States
  protected selectedLocation = signal('');
  protected selectedSalary = signal('');
  protected selectedExperience = signal('');
  protected selectedIndustry = signal('');

  // Dropdown States
  protected showLocationDropdown = signal(false);
  protected showSalaryDropdown = signal(false);
  protected showExperienceDropdown = signal(false);
  protected showIndustryDropdown = signal(false);

  // Mock Jobs Data
  protected allJobs: Job[] = [
    {
      id: '1',
      title: 'Nhân Viên Giám Đốc Quan Hệ Khách Hàng Cá Nhân Mảng Ưu Tiên (Khu Vực...)',
      company: 'Ngân hàng TMCP Quốc Dân',
      location: 'Hà Nội',
      salary: '15 - 30 triệu',
      workType: 'Toàn thời gian',
      skills: ['Tư vấn', 'Quan hệ khách hàng', 'Ngân hàng'],
      postedDate: '2 giờ trước',
      isPro: true,
      isHot: false
    },
    {
      id: '2',
      title: 'Nhân Viên Kinh Doanh Nội Thất - Lương Từ 12 Đến 20 Triệu - Data Co...',
      company: 'CÔNG TY TNHH KENZA VIỆT NAM',
      location: 'Hà Nội',
      salary: '12 - 20 triệu',
      workType: 'Toàn thời gian',
      skills: ['Kinh doanh', 'Nội thất', 'Tư vấn'],
      postedDate: '4 giờ trước',
      isPro: false,
      isHot: true
    },
    {
      id: '3',
      title: 'Trưởng Phòng Kinh Doanh - Hà Nội, ...',
      company: 'VietFresh Official',
      location: 'Hà Nội, Hồ Chí Minh',
      salary: 'Thỏa thuận',
      workType: 'Toàn thời gian',
      skills: ['Quản lý', 'Kinh doanh', 'Thực phẩm'],
      postedDate: '6 giờ trước',
      isPro: true,
      isHot: true
    },
    {
      id: '4',
      title: 'Kế Toán Doanh Thu Đi Làm Ngay - Lương Upto 13tr - Tại Hà Nội',
      company: 'CÔNG TY CỔ PHẦN XUẤT NHẬP KHẨU THƯƠNG MẠI',
      location: 'Hà Nội',
      salary: 'Upto 13 triệu',
      workType: 'Toàn thời gian',
      skills: ['Kế toán', 'Doanh thu', 'Excel'],
      postedDate: '8 giờ trước',
      isPro: false,
      isHot: false
    },
    {
      id: '5',
      title: 'Trưởng Phòng Nhân Sự - Tuyển Dung - Thu Nhập 22 - 30 Triệu/Tháng',
      company: 'Brushte Official',
      location: 'Hà Nối',
      salary: '22 - 30 triệu',
      workType: 'Toàn thời gian',
      skills: ['Nhân sự', 'Tuyển dụng', 'Quản lý'],
      postedDate: '1 ngày trước',
      isPro: false,
      isHot: false
    },
    {
      id: '6',
      title: 'Nhân Viên Nghiên Cứu Và Phát Triển (Fresher)',
      company: 'Công ty TNHH Toyo Ink Compounds Việt Nam',
      location: 'Hà Nội',
      salary: 'Cạnh tranh',
      workType: 'Toàn thời gian',
      skills: ['R&D', 'Nghiên cứu', 'Phát triển'],
      postedDate: '1 ngày trước',
      isPro: false,
      isHot: false
    }
  ];

  // Computed Properties
  protected filteredJobs = computed(() => {
    const location = this.selectedLocation();
    if (!location) return this.allJobs;
    return this.allJobs.filter(job =>
      job.location.toLowerCase().includes(location.toLowerCase())
    );
  });

  protected hasMoreJobs = signal(true);

  // Expose Math to template
  protected Math = Math;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setupResizeListener();
      this.setupClickOutsideListener();
    }
  }

  ngOnDestroy(): void {
    if (this.resizeListener && isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  private setupResizeListener(): void {
    this.resizeListener = () => {
      // Reset carousel position when screen size changes
      if (this.currentCategoryIndex() > this.getMaxCategoryIndex()) {
        this.currentCategoryIndex.set(0);
      }
    };
    window.addEventListener('resize', this.resizeListener);
  }

  private setupClickOutsideListener(): void {
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      // Only close dropdowns if clicking outside the filter container
      if (!target.closest('.filter-dropdown-container')) {
        // Close all dropdowns when clicking outside
        this.showLocationDropdown.set(false);
        this.showSalaryDropdown.set(false);
        this.showExperienceDropdown.set(false);
        this.showIndustryDropdown.set(false);
      }
    });
  }

  // Methods
  protected searchJobs(): void {
    this.uiState.update(state => ({ ...state, searchLoading: true }));

    // Simulate search
    setTimeout(() => {
      console.log('Searching for:', this.searchForm);
      this.uiState.update(state => ({ ...state, searchLoading: false }));
    }, 1000);
  }

  protected selectCategory(category: JobCategory): void {
    console.log('Selected category:', category);
    // Filter jobs by category
  }

  protected previousCategory(): void {
    this.currentCategoryIndex.update(index => Math.max(0, index - 1));
  }

  protected nextCategory(): void {
    const maxIndex = this.getMaxCategoryIndex();
    this.currentCategoryIndex.update(index => Math.min(maxIndex, index + 1));
  }

  // Responsive helper methods for categories
  protected getCategoriesPerSlide(): number {
    // Return different values based on screen size
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 5; // lg screens - 5 items
      if (window.innerWidth >= 768) return 3;  // md screens - 3 items
      return 2; // sm screens - 2 items (but we use grid on mobile)
    }
    return 5; // default for SSR
  }

  protected getMaxCategoryIndex(): number {
    const categoriesPerSlide = this.getCategoriesPerSlide();
    return Math.max(0, this.jobCategories.length - categoriesPerSlide);
  }



  protected showAllCategories(): void {
    console.log('Show all categories');
    // Navigate to categories page or show modal
  }

  protected getCarouselTransform(): string {
    const categoriesPerSlide = this.getCategoriesPerSlide();
    const slidePercentage = 100 / categoriesPerSlide;
    return `translateX(-${this.currentCategoryIndex() * slidePercentage}%)`;
  }

  protected getTotalSlides(): number {
    const categoriesPerSlide = this.getCategoriesPerSlide();
    return Math.ceil(this.jobCategories.length / categoriesPerSlide);
  }

  protected goToSlide(slideIndex: number): void {
    this.currentCategoryIndex.set(slideIndex);
  }

  // Expose Array to template
  protected Array = Array;

  // Filter Methods
  protected filterByLocation(location: string): void {
    this.selectedLocation.set(location);
  }

  protected filterBySalary(salary: string): void {
    this.selectedSalary.set(salary);
  }

  protected filterByExperience(experience: string): void {
    this.selectedExperience.set(experience);
  }

  protected filterByIndustry(industry: string): void {
    this.selectedIndustry.set(industry);
  }

  // Dropdown Toggle Methods
  protected toggleLocationDropdown(): void {
    this.showLocationDropdown.update(show => !show);
    // Close other dropdowns
    this.showSalaryDropdown.set(false);
    this.showExperienceDropdown.set(false);
    this.showIndustryDropdown.set(false);
  }

  protected toggleSalaryDropdown(): void {
    this.showSalaryDropdown.update(show => !show);
    // Close other dropdowns
    this.showLocationDropdown.set(false);
    this.showExperienceDropdown.set(false);
    this.showIndustryDropdown.set(false);
  }

  protected toggleExperienceDropdown(): void {
    this.showExperienceDropdown.update(show => !show);
    // Close other dropdowns
    this.showLocationDropdown.set(false);
    this.showSalaryDropdown.set(false);
    this.showIndustryDropdown.set(false);
  }

  protected toggleIndustryDropdown(): void {
    this.showIndustryDropdown.update(show => !show);
    // Close other dropdowns
    this.showLocationDropdown.set(false);
    this.showSalaryDropdown.set(false);
    this.showExperienceDropdown.set(false);
  }

  // Select and Close Methods
  protected selectLocationAndClose(location: string): void {
    this.selectedLocation.set(location);
    this.showLocationDropdown.set(false);
  }

  protected selectSalaryAndClose(salary: string): void {
    this.selectedSalary.set(salary);
    this.showSalaryDropdown.set(false);
  }

  protected selectExperienceAndClose(experience: string): void {
    this.selectedExperience.set(experience);
    this.showExperienceDropdown.set(false);
  }

  protected selectIndustryAndClose(industry: string): void {
    this.selectedIndustry.set(industry);
    this.showIndustryDropdown.set(false);
  }

  // Label Helper Methods
  protected getLocationLabel(value: string): string {
    const location = this.popularLocations.find(loc => loc.value === value);
    return location?.label || value;
  }

  protected getSalaryLabel(value: string): string {
    const salaryLabels: { [key: string]: string } = {
      'duoi-10': 'Dưới 10 triệu',
      '10-15': '10 - 15 triệu',
      '15-20': '15 - 20 triệu',
      '20-30': '20 - 30 triệu',
      'tren-30': 'Trên 30 triệu',
      'thuong-luong': 'Thỏa thuận'
    };
    return salaryLabels[value] || value;
  }

  protected getExperienceLabel(value: string): string {
    const experienceLabels: { [key: string]: string } = {
      'intern': 'Thực tập sinh',
      'fresher': 'Mới tốt nghiệp (Fresher)',
      '1-2-nam': '1 - 2 năm kinh nghiệm',
      '2-5-nam': '2 - 5 năm kinh nghiệm',
      'tren-5-nam': 'Trên 5 năm kinh nghiệm'
    };
    return experienceLabels[value] || value;
  }

  protected getIndustryLabel(value: string): string {
    const industryLabels: { [key: string]: string } = {
      'it-software': 'Công nghệ thông tin',
      'marketing': 'Marketing / PR',
      'sales': 'Kinh doanh / Bán hàng',
      'accounting': 'Kế toán / Kiểm toán',
      'hr': 'Nhân sự',
      'design': 'Thiết kế đồ họa',
      'banking': 'Ngân hàng / Tài chính'
    };
    return industryLabels[value] || value;
  }

  protected viewJobDetail(job: Job): void {
    console.log('Viewing job:', job);
    // Navigate to job detail page
  }

  protected loadMoreJobs(): void {
    this.uiState.update(state => ({ ...state, loadingMore: true }));

    // Simulate loading more jobs
    setTimeout(() => {
      this.uiState.update(state => ({ ...state, loadingMore: false }));
      // Add more jobs or set hasMoreJobs to false
    }, 1500);
  }

  protected formatNumber(num: number): string {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
}
